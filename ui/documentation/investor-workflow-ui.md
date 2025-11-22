# Investor Finding Workflow - UI Flow

This document describes the user interface flow specific to the investor finding functionality.

## Complete User Journey

### Step 1: Upload Startup Documents

**UI Components**:
- File upload dialog
- Drag & drop zone
- Progress indicators

**User Actions**:
1. Click "New Chat" or "Upload Documents"
2. See upload interface with supported formats
3. Drag files or click to browse
4. Select multiple files (pitch deck, financials, business plan)
5. See upload progress for each file
6. Confirm upload completion

**UI Feedback**:
```
┌─────────────────────────────────────┐
│  Upload Your Startup Documents      │
├─────────────────────────────────────┤
│                                     │
│  [📄] pitch-deck.pdf      ✓         │
│  [📊] financials.xlsx     ✓         │
│  [📝] business-plan.docx  ✓         │
│                                     │
│  Drag files here or click to browse│
│                                     │
│  Supported: PDF, PPT, Excel, CSV   │
└─────────────────────────────────────┘
```

### Step 2: Data Integration & Processing

**UI Components**:
- Processing status indicator
- Progress steps
- Real-time updates

**What Users See**:
```
Processing your documents...

✓ Document parsing complete
⏳ Extracting key information
  - Industry sector
  - Funding stage
  - Market size
  - Team details
□ Matching with investors
□ Analyzing networks
```

**Messages**:
- "Analyzing your startup profile..."
- "Extracting key metrics from financials..."
- "Identified: SaaS, Series A stage, B2B market"

### Step 3: Deepflow Matching Engine Results

**UI Components**:
- Results list
- Investor cards
- Match score indicators
- Filter/sort options

**Display**:
```
┌─────────────────────────────────────┐
│  Found 15 Matching Investors        │
├─────────────────────────────────────┤
│                                     │
│  🎯 Sarah Chen (98% match)          │
│  │  Andreessen Horowitz            │
│  │  Focus: Enterprise SaaS         │
│  │  Stage: Series A-B              │
│  │  [View Details] [Connect]       │
│                                     │
│  🎯 Michael Rivera (94% match)      │
│  │  Sequoia Capital                │
│  │  Focus: B2B Software            │
│  │  Stage: Seed-Series A           │
│  │  [View Details] [Connect]       │
│                                     │
│  📊 [View All 15 Investors]         │
└─────────────────────────────────────┘
```

**Investor Card Details**:
- Name and photo
- Firm/organization
- Investment focus areas
- Typical investment range
- Past portfolio companies
- Match percentage
- Action buttons

### Step 4: LinkedIn Connection Path

**UI Components**:
- Network graph visualization
- Interactive node explorer
- Path highlighter
- Connection details panel

**User Actions**:
1. Click "Show Connection Path" on investor card
2. Graph visualization modal opens
3. See visual network map
4. Hover over nodes for details
5. Click nodes to expand connections

**Graph Visualization**:
```
                    [Target: Sarah Chen]
                           │
                    [Jessica Moore]
                      (mutual: 2)
                          ╱  ╲
                        ╱      ╲
              [David Kim]    [Emma Wilson]
                   │              │
                   └──────┬───────┘
                          │
                   [You: Founder]
```

**Connection Details Panel**:
```
┌─────────────────────────────────────┐
│  Path to Sarah Chen                 │
├─────────────────────────────────────┤
│  🎯 Recommended Path (2 steps)      │
│                                     │
│  You → David Kim → Sarah Chen       │
│                                     │
│  David Kim                          │
│  • Your connection since 2019       │
│  • Works at TechVentures            │
│  • Knows Sarah from Stanford        │
│  • Introduced 5 startups to her     │
│                                     │
│  [Request Introduction]             │
│  [Save to Notion]                   │
│  [Export Graph]                     │
└─────────────────────────────────────┘
```

### Step 5: Action Recommendations

**UI Components**:
- Action checklist
- Templates for outreach
- Timeline planner
- Notion integration button

**Display**:
```
┌─────────────────────────────────────┐
│  Next Steps for Sarah Chen          │
├─────────────────────────────────────┤
│                                     │
│  1. ✓ Review Sarah's portfolio      │
│  2. □ Draft introduction request    │
│     [Use Template]                  │
│  3. □ Contact David Kim             │
│     Suggested message:              │
│     "Hi David, I'm reaching out..." │
│  4. □ Schedule follow-up            │
│  5. □ Track in Notion               │
│     [Add to Notion Database]        │
│                                     │
│  🔔 Reminders:                      │
│  • Best time to reach: Wed-Thu AM   │
│  • Sarah speaks at TechConf next mo│
│  • David's birthday: March 15       │
└─────────────────────────────────────┘
```

### Step 6: Notion Integration

**UI Components**:
- Notion sync button
- Database selector
- Field mapping
- Sync status

**What Gets Saved**:
```
Notion Database Entry:
├── Investor Name: Sarah Chen
├── Firm: Andreessen Horowitz
├── Match Score: 98%
├── Connection Path: You → David Kim → Sarah
├── Status: Pending Introduction
├── Next Action: Contact David
├── Timeline: Within 1 week
├── Notes: Focus on enterprise SaaS positioning
└── Attachments: [pitch-deck.pdf, connection-graph.png]
```

## MCP Server Menu Integration

**MCP Servers Used**:
```
┌─────────────────────────────────────┐
│  MCP Servers                        │
├─────────────────────────────────────┤
│  ✅ LinkedIn Scraper                │
│     Status: Connected               │
│                                     │
│  ✅ Notion Integration              │
│     Status: Connected               │
│     Database: Investors             │
│                                     │
│  ✅ E2B Sandbox                     │
│     Status: Active                  │
│     Purpose: Secure processing      │
│                                     │
│  ✅ Deepflow Engine                 │
│     Status: Ready                   │
│     Investors: 10,000+ in DB        │
│                                     │
│  [+ Add MCP Server]                 │
└─────────────────────────────────────┘
```

## Chat Interface Integration

**Sample Conversation**:
```
User: I need to find investors for my B2B SaaS startup

AI: I'd be happy to help! Please upload your:
    • Pitch deck
    • Financial projections
    • Business plan

    Or tell me about your startup.

User: [Uploads 3 files]

AI: Thanks! I'm analyzing your documents...
    ✓ Company: CloudFlow Analytics
    ✓ Stage: Series A
    ✓ Market: Enterprise Data Analytics
    ✓ Seeking: $5-10M

    Searching for matching investors...

    Great news! I found 15 investors who match your profile.
    Here are the top 3:

    [Investor Cards Display]

    Would you like me to show you how to reach them
    through your LinkedIn network?

User: Yes, show me the path to Sarah Chen

AI: [Opens Network Graph]

    Here's your best path to Sarah Chen:
    You → David Kim → Sarah Chen

    David Kim works at TechVentures and has known
    Sarah since their Stanford days. He's introduced
    5 startups to her successfully.

    Would you like me to:
    1. Draft an introduction request
    2. Save this to Notion
    3. Set up tracking
```

## Error States & Edge Cases

**No Matches Found**:
```
No direct matches found for your criteria.

Suggestions:
• Broaden your stage (include Seed-Series B)
• Consider investors in adjacent markets
• Look at micro-VCs or angel investors

[Adjust Criteria] [Contact Support]
```

**LinkedIn Not Connected**:
```
⚠️ LinkedIn MCP Server Not Connected

To find connection paths, please:
1. Go to MCP Server Menu
2. Enable "LinkedIn Scraper"
3. Authenticate with LinkedIn

[Configure LinkedIn MCP]
```

**File Processing Error**:
```
❌ Error processing pitch-deck.pdf

The file appears to be corrupted or in an
unsupported format.

[Try Again] [Upload Different File]
```

## Mobile Responsive Views

**Mobile Layout**:
- Collapsible sidebar (hamburger menu)
- Full-width investor cards
- Simplified graph view
- Touch-optimized interactions
- Bottom sheet for details

**Tablet Layout**:
- Persistent narrow sidebar
- Two-column investor list
- Side-by-side graph and details
- Optimized for landscape orientation
