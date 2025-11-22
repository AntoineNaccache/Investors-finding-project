# Components Overview

## Core UI Components

### Chatbot Components

#### ChatInterface
**Location**: `src/components/`
**Purpose**: Main chat interface with message display and input

**Features**:
- Message history display
- Real-time streaming responses
- File attachment support
- @mention tool invocation
- Markdown rendering

#### MessageList
**Purpose**: Displays conversation history

**Features**:
- Scrollable message container
- Message grouping by sender
- Timestamp display
- File preview

#### MessageInput
**Purpose**: User input area with file attachments

**Features**:
- Multiline text input
- File drag & drop
- @mention autocomplete
- Send button with keyboard shortcuts

### Sidebar Components

#### RecentChats
**Location**: `src/components/layouts/`
**Purpose**: Shows recent conversation history

**Features**:
- List of recent chats
- Search functionality
- Delete/archive options
- Active chat highlighting

#### Navigation
**Purpose**: Main navigation sidebar

**Features**:
- Chat history
- Settings access
- MCP server management
- User profile

### MCP Management

#### MCPServerList
**Location**: `src/components/`
**Purpose**: Manage MCP server connections

**Features**:
- List of available MCP servers
- Enable/disable toggles
- Server status indicators
- Add new server
- Configuration options

#### MCPServerConfig
**Purpose**: Configure individual MCP servers

**Features**:
- Server connection settings
- Transport type selection (HTTP/SSE)
- Environment variables
- Test connection

### File Components

#### FileUpload
**Location**: `src/components/`
**Purpose**: File upload interface

**Features**:
- Drag & drop zone
- File type validation
- Upload progress
- Multiple file support
- Preview thumbnails

**Supported Formats**:
- CSV
- Excel (.xlsx, .xls)
- PowerPoint (.pptx, .ppt)
- PDF
- Text (.txt, .md)

#### FilePreview
**Purpose**: Preview uploaded files

**Features**:
- File type icons
- File size display
- Download option
- Remove button

### Tool Invocation

#### ToolMention
**Location**: `src/components/tool-invocation/`
**Purpose**: @mention system for invoking tools

**Features**:
- Autocomplete dropdown
- Tool search
- Tool parameter input
- Execution status

#### ToolResult
**Purpose**: Display tool execution results

**Features**:
- Result formatting
- Error handling
- Data visualization
- Copy to clipboard

### Graph Visualization

#### NetworkGraph
**Location**: `src/components/workflow/`
**Purpose**: Visualize LinkedIn connection paths

**Features**:
- Node-based graph rendering
- Connection path highlighting
- Interactive nodes
- Zoom/pan controls
- Export as image

**Use Case**: Shows how a founder can reach an investor through their LinkedIn network.

### UI Primitives

#### Button
**Location**: `src/components/ui/button.tsx`
**Variants**: default, destructive, outline, secondary, ghost, link
**Sizes**: default, sm, lg, icon

#### Input
**Location**: `src/components/ui/input.tsx`
**Types**: text, email, password, file

#### Dialog
**Location**: `src/components/ui/dialog.tsx`
**Purpose**: Modal dialogs for confirmations and forms

#### Select
**Location**: `src/components/ui/select.tsx`
**Purpose**: Dropdown selection

#### Switch
**Location**: `src/components/ui/switch.tsx`
**Purpose**: Toggle switches

#### Tooltip
**Location**: `src/components/ui/tooltip.tsx`
**Purpose**: Hover tooltips

## Layout Components

### MainLayout
**Location**: `src/components/layouts/`
**Purpose**: Main application layout

**Structure**:
```
┌─────────────────────────────────────┐
│  Sidebar  │  Main Content Area      │
│           │  - Chat Interface       │
│  - Recent │  - Messages             │
│    Chats  │  - Input                │
│  - Nav    │                         │
│           │                         │
└─────────────────────────────────────┘
```

### AuthLayout
**Location**: `src/components/auth/`
**Purpose**: Authentication pages layout

## State Management

Components use:
- **React Hooks** for local state
- **Zustand** for global state
- **SWR** for data fetching
- **Context API** for theme and auth

## Styling

All components use:
- **Tailwind CSS** for styling
- **CVA** (class-variance-authority) for variants
- **cn()** utility for class merging
- **Framer Motion** for animations
