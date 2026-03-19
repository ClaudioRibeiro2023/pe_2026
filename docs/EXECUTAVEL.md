# Estrategico Aero - Executavel Desktop

## Instalador Pronto para Uso

O instalador NSIS assinado esta disponivel em:

```
release\EstrategicoAero-Setup-1.0.0.exe
```

**Tamanho:** ~220 MB  
**Plataforma:** Windows 10/11 (64-bit)

---

## Como Instalar

1. Execute `EstrategicoAero-Setup-1.0.0.exe`
2. Siga o assistente de instalacao
3. O app sera instalado e um atalho criado no Desktop/Menu Iniciar

### Locais de Instalacao Padrao
- **Por usuario:** `C:\Users\<usuario>\AppData\Local\Programs\pe-2026`
- **Customizado:** Voce pode escolher durante a instalacao

---

## Gerar Nova Versao (Apos Atualizacoes)

### Metodo Simples (Batch)
```
De duplo-clique em: build-app.bat
```

### Metodo PowerShell (Recomendado)
```powershell
.\build-app.ps1
```

### Metodo Manual
```bash
npm install
npm run electron:build
```

### Assinar o Instalador (Obrigatorio para Smart App Control)
```powershell
$thumbprint = '009A422E8CEB0F79FEDCADB0601AC0DB6597045D'
$cert = Get-ChildItem -Path "Cert:\CurrentUser\My\$thumbprint"
Set-AuthenticodeSignature -FilePath "release\EstrategicoAero-Setup-1.0.0.exe" -Certificate $cert -HashAlgorithm SHA256
```

### Deploy de Atualizacoes
```
De duplo-clique em: deploy-update.bat
```
Isso copia o instalador e metadata para `C:\Updates\EstrategicoAero`

---

## Estrutura de Arquivos

```
PE_2026/
├── release/                          # Arquivos gerados
│   ├── EstrategicoAero-Setup-1.0.0.exe      # INSTALADOR NSIS
│   ├── EstrategicoAero-Setup-1.0.0.exe.blockmap
│   ├── latest.yml                    # Metadata para auto-update
│   └── win-unpacked/                 # Versao descompactada
├── build-app.bat                     # Script de build (Windows)
├── build-app.ps1                     # Script de build (PowerShell)
├── deploy-update.bat                 # Deploy para pasta de updates
├── build/
│   ├── icon.ico                      # Icone do app
│   └── codesign.cer                  # Certificado de assinatura
├── electron/                         # Codigo do Electron
│   ├── main.ts                       # Processo principal
│   └── preload.ts                    # Preload script
└── electron-builder.yml              # Configuracao do builder
```

---

## Requisitos para Desenvolvimento

- **Node.js** 18+ (https://nodejs.org)
- **npm** 9+
- **Windows** 10/11 (64-bit)

---

## Caracteristicas do Executavel

- **Instalador NSIS** - Instalacao limpa com desinstalador
- **Assinado** - Certificado de codigo para Smart App Control
- **Offline** - Funciona sem internet (modo demo)
- **Auto-update local** - Verifica atualizacoes em `C:\Updates\EstrategicoAero`
- **Seguro** - Sandbox e isolamento de contexto  

---

## Solucao de Problemas

### "Uma politica de Controle de Aplicativo bloqueou este arquivo"
O instalador precisa estar assinado. Execute o comando de assinatura acima.

### "Windows protegeu seu PC"
1. Clique em "Mais informacoes"
2. Clique em "Executar assim mesmo"

### Aplicacao nao abre
1. Verifique se tem Windows 10/11 64-bit
2. Tente executar como Administrador
3. Verifique se o instalador foi assinado

### Erro de build
```bash
# Limpar cache e reconstruir
npm cache clean --force
rm -rf node_modules
npm install
npm run electron:build
```

### Certificado de Assinatura
O certificado self-signed foi criado e adicionado aos stores:
- `Cert:\CurrentUser\My` (certificado pessoal)
- `Cert:\CurrentUser\Root` (CA raiz confiavel)
- `Cert:\CurrentUser\TrustedPublisher` (publisher confiavel)

Thumbprint: `009A422E8CEB0F79FEDCADB0601AC0DB6597045D`

---

## Versao

- **Aplicacao:** 1.0.0
- **Electron:** 40.1.0
- **Node:** 18+

---

## Auto-Update Local

O app verifica atualizacoes na pasta `C:\Updates\EstrategicoAero`.

Para publicar uma nova versao:
1. Incremente a versao em `package.json`
2. Execute `build-app.bat` ou `npm run electron:build`
3. Assine o instalador (comando acima)
4. Execute `deploy-update.bat`

O app detectara a nova versao e oferecera para atualizar.

---

*Estrategico Aero - Planejamento que Decola*
