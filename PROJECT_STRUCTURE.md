# Project Structure

This document describes the organized folder structure of the Investors Finding Project.

## Root Directory Structure

```
investors-finding-project/
├── src/                    # Frontend source code (Next.js/React)
├── backend/                # Backend services and integrations
├── ui/                     # UI documentation and design assets
├── docs/                   # Project documentation
├── docker/                 # Docker configurations
├── scripts/                # Build and utility scripts
├── public/                 # Static assets served by Next.js
├── messages/               # i18n message files
├── .husky/                 # Git hooks
├── .next/                  # Next.js build output (gitignored)
├── node_modules/           # Dependencies (gitignored)
├── .env                    # Environment variables (gitignored)
├── .env.example            # Example environment variables
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── next.config.ts          # Next.js configuration
├── drizzle.config.ts       # Database ORM configuration
├── biome.json              # Code formatter configuration
├── components.json         # shadcn/ui configuration
├── LICENSE                 # MIT License
└── README.md               # Main project documentation
```

## Source Code (`src/`)

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication routes
│   ├── (chat)/            # Main chat interface routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
│
├── components/             # React components
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── layouts/           # Layout components
│   ├── auth/              # Authentication components
│   ├── agent/             # AI agent components
│   ├── workflow/          # Workflow visualization
│   ├── tool-invocation/   # Tool execution components
│   ├── admin/             # Admin panel components
│   ├── user/              # User management components
│   └── export/            # Data export components
│
├── lib/                    # Utility libraries
│   ├── auth/              # Authentication logic
│   ├── db/                # Database client and schemas
│   ├── mcp/               # MCP client integration
│   ├── ai/                # AI provider configurations
│   └── utils/             # Helper functions
│
├── hooks/                  # Custom React hooks
│   ├── use-chat.ts        # Chat functionality
│   ├── use-mcp.ts         # MCP server management
│   └── use-file-upload.ts # File upload handling
│
├── types/                  # TypeScript type definitions
│   ├── chat.ts            # Chat-related types
│   ├── mcp.ts             # MCP types
│   └── investor.ts        # Investor-specific types
│
├── i18n/                   # Internationalization
│   └── request.ts         # i18n configuration
│
├── middleware.ts           # Next.js middleware
└── instrumentation.ts      # Application instrumentation
```

## Backend (`backend/`)

```
backend/
├── mcp-servers/            # Model Context Protocol servers
│   ├── custom/            # Custom MCP server implementation
│   │   └── index.ts       # Main MCP server code
│   └── examples/          # Example MCP servers
│       └── weather_tools/ # Sample weather tools
│
├── e2b-sandbox/           # E2B secure sandbox integrations
│   ├── investor-db/       # Investor database handlers
│   ├── founder-data/      # Founder data processors
│   └── README.md          # E2B integration docs
│
├── deepflow-engine/       # Investor matching engine
│   ├── matching/          # Matching algorithms
│   ├── database/          # Investor database
│   └── README.md          # Deepflow documentation
│
└── api/                   # Backend API services
    ├── routes/            # API route handlers
    ├── middleware/        # API middleware
    └── README.md          # API documentation
```

## UI Documentation (`ui/`)

```
ui/
├── README.md              # UI overview
├── design-system/         # Design system documentation
│   ├── colors.md          # Color palette
│   ├── typography.md      # Font system (to be added)
│   └── spacing.md         # Spacing scale (to be added)
│
├── documentation/         # Component & flow documentation
│   ├── components-overview.md      # All components listed
│   ├── ui-structure.md             # Component hierarchy
│   └── investor-workflow-ui.md     # Investor flow UI
│
├── assets/                # UI assets
│   └── .gitkeep
│
└── mockups/               # Design mockups & wireframes
    ├── architecture-diagram.jpg
    ├── workflow-overview.jpg
    └── system-components.jpg
```

## Documentation (`docs/`)

```
docs/
├── architecture/          # Architecture documentation
│   ├── images/           # Architecture diagrams
│   └── pdfs/             # PDF documentation
│
├── guides/               # User and developer guides
│   ├── setup.md          # Setup guide (to be added)
│   ├── deployment.md     # Deployment guide (to be added)
│   └── mcp-integration.md # MCP integration guide (to be added)
│
└── api-reference/        # API documentation
    └── README.md         # API reference (to be added)
```

## Docker (`docker/`)

```
docker/
├── compose.yml           # Docker Compose configuration
├── Dockerfile            # Application Dockerfile
└── .env                  # Docker environment variables
```

## Scripts (`scripts/`)

```
scripts/
├── initial-env.ts        # Initialize environment variables
├── postinstall.ts        # Post-installation setup
├── db-migrate.ts         # Database migration
├── clean.ts              # Cleanup script
└── ...                   # Other utility scripts
```

## Configuration Files

### TypeScript
- `tsconfig.json` - TypeScript compiler configuration
- `next-env.d.ts` - Next.js TypeScript declarations

### Database
- `drizzle.config.ts` - Drizzle ORM configuration
- Database schemas in `src/lib/db/schema/`

### Code Quality
- `biome.json` - Biome formatter/linter configuration
- `.eslintrc.json` - ESLint configuration
- `.husky/` - Git hooks for pre-commit checks

### Styling
- `components.json` - shadcn/ui component configuration
- `postcss.config.mjs` - PostCSS configuration
- `src/app/globals.css` - Tailwind CSS setup

### AI Integration
- `openai-compatible.config.ts` - OpenAI-compatible providers config

## Key Folders Explained

### Frontend (`src/`)
All Next.js and React code for the user interface, including components, pages, hooks, and utilities.

### Backend (`backend/`)
Backend services including MCP servers, E2B sandbox integrations, and the Deepflow matching engine.

### UI Documentation (`ui/`)
Design system, component documentation, and UI/UX specifications separate from the actual code.

### Project Documentation (`docs/`)
Architecture diagrams, setup guides, API references, and other project-level documentation.

## Ignored Folders (`.gitignore`)

```
.env
.next/
node_modules/
dist/
build/
*.log
.DS_Store
```

## Getting Started

1. **Frontend Development**: Work in `src/` directory
2. **Backend Services**: Develop in `backend/` directory
3. **UI Design**: Document in `ui/` directory
4. **Documentation**: Write guides in `docs/` directory

## Naming Conventions

- **Folders**: kebab-case (`mcp-servers`, `e2b-sandbox`)
- **Components**: PascalCase (`ChatInterface.tsx`, `MessageList.tsx`)
- **Utilities**: camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)

## Import Paths

The project uses TypeScript path aliases:
```typescript
import { Button } from '@/components/ui/button'
import { useChat } from '@/hooks/use-chat'
import { db } from '@/lib/db'
```

Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
