# UI Structure & Component Map

## Application Structure

```
Investors Finding Project UI
│
├── Authentication Flow
│   ├── Login Page
│   ├── Sign Up Page
│   └── OAuth Providers (Google, GitHub, Microsoft)
│
└── Main Application
    │
    ├── Layout
    │   ├── Sidebar (Collapsible)
    │   │   ├── Logo/Branding
    │   │   ├── Recent Chats List
    │   │   ├── New Chat Button
    │   │   ├── MCP Server Menu
    │   │   └── User Profile Menu
    │   │
    │   └── Main Content Area
    │       ├── Chat Header
    │       │   ├── Chat Title
    │       │   ├── Model Selector
    │       │   └── Settings Icon
    │       │
    │       ├── Chat Messages Area
    │       │   ├── Message Bubbles
    │       │   │   ├── User Messages
    │       │   │   ├── AI Responses
    │       │   │   ├── System Messages
    │       │   │   └── File Attachments
    │       │   │
    │       │   └── Tool Invocations
    │       │       ├── Tool Status
    │       │       ├── Tool Results
    │       │       └── Visualizations
    │       │
    │       └── Input Area
    │           ├── Text Input (with @mention)
    │           ├── File Attachment Button
    │           ├── Emoji Picker
    │           └── Send Button
    │
    └── Modals & Overlays
        ├── MCP Server Configuration
        ├── Settings Panel
        ├── File Preview
        └── Network Graph Visualization
```

## Page Routes

```
/                           → Main chat interface
/auth/signin               → Sign in page
/auth/signup               → Sign up page
/settings                  → User settings
/admin                     → Admin panel (if admin user)
```

## Component Hierarchy

```
App
├── AuthProvider
├── ThemeProvider
└── MainLayout
    ├── Sidebar
    │   ├── Logo
    │   ├── RecentChatsList
    │   │   └── ChatListItem[]
    │   ├── NewChatButton
    │   ├── MCPServerMenu
    │   │   └── MCPServerToggle[]
    │   └── UserMenu
    │       ├── ProfileInfo
    │       ├── Settings
    │       └── Logout
    │
    └── ChatArea
        ├── ChatHeader
        │   ├── ChatTitle
        │   ├── ModelSelector
        │   │   └── ModelOption[]
        │   └── SettingsButton
        │
        ├── MessagesList
        │   └── Message[]
        │       ├── MessageContent
        │       ├── MessageTime
        │       ├── FileAttachment[]
        │       └── ToolInvocation
        │           ├── ToolStatus
        │           └── ToolResult
        │
        └── InputArea
            ├── TextInput
            │   └── MentionSuggestions
            ├── FileUploadButton
            │   └── FileUploadDialog
            ├── EmojiPicker
            └── SendButton
```

## Key Interactions

### File Upload Flow
```
1. User clicks attachment button OR drags file
2. FileUploadDialog opens
3. User selects file(s)
4. File validation (type, size)
5. Upload progress shown
6. File attached to message
7. Send message with file(s)
```

### MCP Server Management Flow
```
1. User clicks MCP Server Menu
2. MCPServerList displays
3. User toggles server on/off
4. Connection status updates
5. Server tools become available
6. Tools appear in @mention autocomplete
```

### @Mention Tool Invocation Flow
```
1. User types @ in chat
2. Autocomplete shows available tools
3. User selects tool
4. Tool parameters prompt (if needed)
5. Tool execution starts
6. Loading state shown
7. Results displayed in chat
```

### Network Graph Flow
```
1. User uploads startup docs
2. System finds matching investors
3. User clicks "Show Connection Path"
4. Graph visualization opens
5. Network graph renders
   - Founder (center)
   - Connections (1st degree)
   - Investor (target)
   - Path highlighted
6. User can interact with nodes
7. Export graph option available
```

## Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Mobile Layout
- Sidebar collapses to hamburger menu
- Full-width chat area
- Bottom navigation bar
- Stacked components

### Desktop Layout
- Persistent sidebar (collapsible)
- Split-view layout
- Hover tooltips
- Keyboard shortcuts enabled

## Accessibility

All components support:
- ✅ Keyboard navigation
- ✅ Screen readers (ARIA labels)
- ✅ Focus indicators
- ✅ Color contrast (WCAG AA)
- ✅ Reduced motion support

## Performance Optimizations

- **Lazy Loading**: Route-based code splitting
- **Virtual Scrolling**: For long message lists
- **Image Optimization**: Next.js Image component
- **Memoization**: React.memo for expensive components
- **Debouncing**: Input and search operations
