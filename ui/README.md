# UI Documentation

This folder contains all UI-related documentation, design assets, and component specifications for the Investors Finding Project.

## Folder Structure

```
ui/
├── design-system/      # Design tokens, colors, typography, spacing
├── assets/            # UI assets (icons, images, logos)
├── mockups/           # Design mockups and wireframes
└── documentation/     # Component documentation and guidelines
```

## Key UI Features

### 1. Chatbot Interface
- Main conversation area with message history
- Support for text, file attachments, and AI responses
- Real-time streaming responses
- Markdown rendering with code syntax highlighting

### 2. Sidebar Navigation
- Recent conversations list
- Chat history management
- Quick access to previous sessions
- Search functionality

### 3. File Attachment System
- Drag & drop support
- Multiple file formats: CSV, Excel, PPT, PDF, TXT
- File preview capabilities
- Upload progress indicators

### 4. MCP Server Management
- MCP server configuration panel
- Enable/disable server toggles
- Server status indicators
- Connection management

### 5. Tools & Features
- @mention system for tool invocation
- Autocomplete suggestions
- Tool result visualization
- Graph rendering for network connections

## Design System

The UI uses:
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Themes**: Light/Dark mode support

## Component Library

All UI components are located in `src/components/`:

- `ui/` - Base UI components (buttons, inputs, dialogs)
- `auth/` - Authentication components
- `layouts/` - Layout components
- `agent/` - AI agent specific components
- `workflow/` - Workflow visualization components
- `tool-invocation/` - Tool execution components

## Getting Started

To work with the UI:

1. Run the development server: `pnpm dev`
2. Open http://localhost:3000
3. Components are hot-reloaded automatically
4. Check `src/components/ui/` for reusable components

## Customization

### Colors
Edit `src/app/globals.css` for theme colors using CSS variables.

### Components
Components use `class-variance-authority` for variants and `tailwind-merge` for class composition.

### Responsive Design
All components are mobile-first and responsive by default.
