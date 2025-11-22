# Investors Finding Project

An AI-powered platform that helps startups find and connect with matching investors through intelligent data analysis and LinkedIn network mapping.

## Overview

This project automates the investor discovery process by analyzing startup documentation, matching founders with relevant investors, and mapping the shortest path through LinkedIn connections to reach those investors.

## Architecture & Workflow

![Architecture Diagram](docs/images/architecture-diagram.jpg)

![Workflow Overview](docs/images/workflow-overview.jpg)

![System Components](docs/images/system-components.jpg)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           INPUT STAGE                                    │
│  Startup Documents: CSV, Excel, PPT, PDF, TXT                           │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    DATA INTEGRATION STAGE                                │
│  - Document parsing and data extraction                                  │
│  - Standardization and formatting                                        │
│  - Data validation                                                       │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        DEEPFLOW ENGINE                                   │
│  - Core matching algorithm                                               │
│  - Investor database with investment criteria                           │
│  - AI-powered relevance scoring                                          │
│  - Outputs: List of matching investors                                   │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    AGENTIC MCP MODULE                                    │
│  - MCP (Model Context Protocol) connections                             │
│  - LinkedIn network scraping & analysis                                  │
│  - Connection path finding algorithm                                     │
│  - Graph visualization generation                                        │
│  - Outputs: Network graph showing connection paths to investors         │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         OUTPUT STAGE                                     │
│  - Matched investor profiles                                             │
│  - LinkedIn connection path visualization                                │
│  - Actionable contact recommendations                                    │
│  - Data stored in Notion (Docker MCP server)                            │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Data Integration Layer
Processes multiple document formats to extract startup information:
- Business plans (PDF, PPT)
- Financial data (CSV, Excel)
- Project descriptions (TXT, MD)

### 2. Deepflow Matching Engine
- Maintains comprehensive investor database
- Analyzes investment criteria and preferences
- Matches startups with investors based on:
  - Industry sector
  - Stage (seed, Series A, etc.)
  - Investment range
  - Geographic preferences
  - Past investment portfolio

### 3. E2B Secure Sandbox
- Handles sensitive data processing
- Secure investor database operations
- Protected founder information handling
- Ensures data privacy and compliance

### 4. Agentic MCP Module
- Connects to LinkedIn via MCP
- Maps founder's network connections
- Identifies mutual connections to target investors
- Generates visual graph showing the shortest path
- Provides actionable networking strategy

### 5. Notion Integration
- Docker-based MCP server
- Stores matched investor data
- Tracks outreach progress
- Maintains connection strategies

## Features

- **Multi-format Document Processing**: Accepts various file types for startup information
- **Intelligent Investor Matching**: AI-powered analysis to find relevant investors
- **Network Path Mapping**: Visualizes LinkedIn connection paths to investors
- **Secure Data Handling**: E2B sandbox for sensitive information
- **Centralized Management**: Notion integration for tracking and organization

## Technology Stack

- **E2B**: Secure sandbox environment for data processing
- **Deepflow**: Custom investor matching engine
- **MCP (Model Context Protocol)**: Integration layer for external services
- **Notion**: Database and project management (Docker MCP server)
- **LinkedIn API**: Network analysis and connection mapping
- **Graph Visualization**: Network path rendering

## Use Case Example

1. **Founder uploads** startup pitch deck, business plan, and financial projections
2. **System processes** documents and extracts key information
3. **Deepflow analyzes** data and returns 15 matching investors
4. **MCP module accesses** founder's LinkedIn network
5. **System generates** graph showing: "You can reach Investor X through your connection Sarah, who knows them directly"
6. **Results stored** in Notion with recommended outreach strategy

## Project Structure

```
investors-finding-project/
├── src/               # Frontend (Next.js/React)
├── backend/           # Backend services
│   ├── mcp-servers/   # MCP integrations
│   ├── e2b-sandbox/   # Secure data processing
│   └── deepflow-engine/ # Investor matching
├── ui/                # UI documentation
├── docs/              # Project documentation
└── docker/            # Docker configurations
```

📖 See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed structure

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Docker (optional)
- pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/investors-finding-project.git
cd investors-finding-project
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env and add your API keys:
# - GROQ_API_KEY
# - E2B_API_KEY
# - POSTGRES_URL
```

4. **Start PostgreSQL**
```bash
pnpm docker:pg
```

5. **Run database migrations**
```bash
pnpm db:push
```

6. **Start development server**
```bash
pnpm dev
```

7. **Open your browser**
Navigate to http://localhost:3000

## Configuration

### API Keys Required

- **GROQ_API_KEY**: For AI chat functionality (get from https://console.groq.com/)
- **E2B_API_KEY**: For secure sandbox execution (get from https://e2b.dev)
- **POSTGRES_URL**: Database connection string

### Optional Integrations

- LinkedIn MCP server
- Notion MCP server
- OAuth providers (Google, GitHub, Microsoft)

See [`.env.example`](.env.example) for all configuration options.

## Usage

### Basic Workflow

1. **Upload Startup Documents**
   - Drag & drop pitch deck, financials, business plan
   - Supported: PDF, PPT, Excel, CSV, TXT

2. **AI Analysis**
   - System extracts key information
   - Identifies industry, stage, funding needs

3. **Get Matched Investors**
   - Deepflow engine finds 15+ relevant investors
   - View match scores and details

4. **Find Connection Paths**
   - See LinkedIn network visualization
   - Identify mutual connections
   - Get introduction recommendations

5. **Save to Notion**
   - Export matched investors
   - Track outreach progress

## Documentation

- 📁 [Project Structure](PROJECT_STRUCTURE.md) - Detailed folder organization
- 🎨 [UI Documentation](ui/README.md) - UI components and design system
- ⚙️ [Backend Services](backend/README.md) - Backend architecture
- 🔒 [E2B Sandbox](backend/e2b-sandbox/README.md) - Secure data handling
- 🎯 [Deepflow Engine](backend/deepflow-engine/README.md) - Matching algorithm

## Contributing

Contributions are welcome! Please read our contribution guidelines before submitting PRs.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Based on [better-chatbot](https://github.com/cgoinglove/better-chatbot) by cgoinglove.

## Support

For issues and questions:
- Create an issue in this repository
- Check existing documentation
- Review the [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
