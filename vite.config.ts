import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

const isAnalyze = process.env.ANALYZE === 'true'
const isElectron = process.env.ELECTRON === 'true'

// Electron plugins are loaded dynamically only when needed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getElectronPlugins = async (): Promise<any[]> => {
  if (!isElectron) return []

  const plugins: any[] = []

  try {
    const electronModule = 'vite-plugin-electron'
    const electron = await import(electronModule)
    plugins.push(
      electron.default([
        {
          entry: 'electron/main.ts',
          onstart(options: { startup: () => void }) {
            options.startup()
          },
          vite: {
            build: {
              outDir: 'dist-electron',
              rollupOptions: {
                external: ['electron', 'electron-updater'],
              },
            },
          },
        },
        {
          entry: 'electron/preload.ts',
          onstart(options: { reload: () => void }) {
            options.reload()
          },
          vite: {
            build: {
              outDir: 'dist-electron',
              rollupOptions: {
                external: ['electron'],
              },
            },
          },
        },
      ])
    )
  } catch {
    console.warn('vite-plugin-electron não disponível, pulando build do main/preload.')
  }

  try {
    const rendererModule = 'vite-plugin-electron-renderer'
    const renderer = await import(rendererModule)
    plugins.push(renderer.default())
  } catch {
    console.warn('vite-plugin-electron-renderer não disponível, continuando sem renderer plugin.')
  }

  return plugins
}

export default defineConfig(async () => {
  const electronPlugins = await getElectronPlugins()
  
  return {
    plugins: [
      react(),
      ...electronPlugins,
      isAnalyze &&
        visualizer({
          filename: 'dist/bundle-report.html',
          gzipSize: true,
          brotliSize: true,
          open: false,
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        'react-router-dom': path.resolve(__dirname, './node_modules/react-router-dom'),
        'react-router': path.resolve(__dirname, './node_modules/react-router'),
      },
      dedupe: ['react', 'react-dom', 'react-router-dom', 'react-router'],
    },
    server: {
      port: 3000,
      open: true,
      hmr: {
        overlay: true,
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'react-router'],
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return

            if (id.includes('@supabase/')) return 'vendor-supabase'
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'vendor-chartjs'
            if (id.includes('html2canvas')) return 'vendor-html2canvas'
            if (id.includes('jspdf') || id.includes('jspdf-autotable')) return 'vendor-jspdf'
            if (id.includes('dompurify')) return 'vendor-purify'
            if (id.includes('date-fns') || id.includes('react-day-picker')) return 'vendor-dates'

            return
          },
        },
      },
    },
  }
})
