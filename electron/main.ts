import { app, BrowserWindow, shell, ipcMain, nativeTheme, dialog } from 'electron'
import updater from 'electron-updater'
import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// ESM compatibility: base directory from import.meta.url
const appDir = dirname(fileURLToPath(import.meta.url))

const { autoUpdater } = updater

// Disable GPU acceleration for better compatibility
app.disableHardwareAcceleration()

let mainWindow: BrowserWindow | null = null

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const RENDERER_DIST = join(appDir, '../dist')

// Configurar pasta de updates local
const UPDATE_FOLDER = 'C:\\Updates\\EstrategicoAero'

function createWindow() {
  // Usar ícone ICO em produção, SVG em dev
  const iconPath = app.isPackaged
    ? join(process.resourcesPath, 'build', 'icon.ico')
    : join(appDir, '../public/favicon.svg')

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: iconPath,
    title: 'Estratégico Aero - Planejamento que Decola',
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1a1a2e' : '#ffffff',
    show: false,
    webPreferences: {
      preload: join(appDir, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  })

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  // Load the app
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(RENDERER_DIST, 'index.html'))
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Auto-updater configuration
function setupAutoUpdater() {
  if (!app.isPackaged) {
    console.log('Auto-updater desabilitado em modo de desenvolvimento')
    return
  }

  // Garantir que a pasta de updates exista
  if (!existsSync(UPDATE_FOLDER)) {
    mkdirSync(UPDATE_FOLDER, { recursive: true })
  }

  // Configurar URL de updates para pasta local
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: `file:///${UPDATE_FOLDER.replace(/\\/g, '/')}`
  })

  autoUpdater.autoDownload = false // Perguntar antes de baixar
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('checking-for-update', () => {
    console.log('Verificando atualizações em:', UPDATE_FOLDER)
  })

  autoUpdater.on('update-available', async (info) => {
    console.log('Atualização disponível:', info.version)
    
    const result = await dialog.showMessageBox(mainWindow!, {
      type: 'info',
      title: 'Atualização Disponível',
      message: `Nova versão ${info.version} disponível!`,
      detail: 'Deseja baixar e instalar a atualização agora?',
      buttons: ['Atualizar Agora', 'Depois'],
      defaultId: 0,
      cancelId: 1
    })

    if (result.response === 0) {
      autoUpdater.downloadUpdate()
    }
  })

  autoUpdater.on('update-not-available', () => {
    console.log('Nenhuma atualização disponível')
  })

  autoUpdater.on('download-progress', (progress) => {
    const percent = Math.round(progress.percent)
    mainWindow?.setProgressBar(percent / 100)
    mainWindow?.setTitle(`Estratégico Aero - Baixando atualização ${percent}%`)
  })

  autoUpdater.on('update-downloaded', async (info) => {
    console.log('Atualização baixada:', info.version)
    mainWindow?.setProgressBar(-1) // Remove progress bar
    mainWindow?.setTitle('Estratégico Aero - Planejamento que Decola')

    const result = await dialog.showMessageBox(mainWindow!, {
      type: 'info',
      title: 'Atualização Pronta',
      message: `Versão ${info.version} pronta para instalar!`,
      detail: 'A aplicação será reiniciada para aplicar a atualização.',
      buttons: ['Reiniciar Agora', 'Depois'],
      defaultId: 0,
      cancelId: 1
    })

    if (result.response === 0) {
      autoUpdater.quitAndInstall(false, true)
    }
  })

  autoUpdater.on('error', (err) => {
    console.error('Erro no auto-updater:', err.message)
    // Não mostrar erro se a pasta de updates não existir
    if (!err.message.includes('ENOENT')) {
      mainWindow?.webContents.send('update-error', err.message)
    }
  })
}

// IPC handlers
ipcMain.handle('get-app-version', () => app.getVersion())

ipcMain.handle('check-for-updates', async () => {
  if (!app.isPackaged) {
    return null
  }

  try {
    const result = await autoUpdater.checkForUpdates()
    return result?.updateInfo
  } catch (error) {
    console.error('Error checking for updates:', error)
    return null
  }
})

ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall(false, true)
})

ipcMain.handle('get-platform', () => process.platform)

ipcMain.handle('get-theme', () => nativeTheme.shouldUseDarkColors ? 'dark' : 'light')

// App lifecycle
app.whenReady().then(() => {
  createWindow()
  setupAutoUpdater()

  // Check for updates after 3 seconds
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(console.error)
  }, 3000)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Security: Prevent navigation to external URLs
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (event, url) => {
    const parsedUrl = new URL(url)
    if (parsedUrl.origin !== 'file://') {
      event.preventDefault()
    }
  })
})
