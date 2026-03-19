# Template App — Aplicações Internas

Template canônico para construção de aplicações internas com:

- **Vite + React + TypeScript**
- **TailwindCSS** (componentes próprios)
- **Supabase** (Auth + Postgres + RLS)
- Deploy via **Netlify (Git Deploy)**

## Início Rápido

### 1. Instalar dependências

```bash
cd template
npm install
```

### 2. Configurar ambiente

Copie `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais do Supabase:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### 4. Build para produção

```bash
npm run build
```

Os arquivos serão gerados em `dist/`.

## Estrutura do Projeto

```
src/
├── app/                 # Bootstrap, rotas, layout, guards
│   └── pages/           # Páginas globais (ex: 404)
├── features/            # Features por domínio (auth, etc.)
│   └── <feature>/pages  # Páginas por domínio
├── shared/              # Código compartilhado
│   ├── config/          # Configurações (env, routes)
│   ├── lib/             # Helpers e utilitários
│   ├── types/           # Tipos TypeScript
│   └── ui/              # Componentes UI reutilizáveis
└── styles/              # CSS global
```

## Componentes UI Disponíveis

- `Button` - Botão com variantes e loading
- `Input` - Campo de texto com label e erro
- `Select` - Select com opções
- `Card` - Card com header, content e footer
- `Table` - Tabela responsiva
- `Modal` - Modal com overlay
- `Toast` - Notificações toast
- `Loader` - Indicador de carregamento
- `EmptyState` - Estado vazio
- `ErrorState` - Estado de erro

## Deploy no Netlify

1. Conecte o repositório ao Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `dist`

Veja `netlify.toml` para mais detalhes.

## Documentação

- `docs/FEATURES.md` - Guia completo de funcionalidades
- `docs/design-system.md` - Diretrizes de UI e componentes
- `docs/setup/INSTRUCOES_SETUP.md` - Configuração do Supabase e setup
- `docs/implementation/IMPLEMENTATION_SUMMARY.md` - Resumo das implementações

## Modo Demo

Se as variáveis do Supabase não estiverem configuradas, o app roda em **modo demo**:
- Qualquer credencial é aceita no login
- Dados são mockados localmente

Isso permite testar a UI sem precisar de um projeto Supabase.
