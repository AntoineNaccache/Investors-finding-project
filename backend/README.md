# Backend Services

This directory contains all backend services and integrations for the Investors Finding Project.

## Directory Structure

```
backend/
├── mcp-servers/       # Model Context Protocol servers
├── e2b-sandbox/       # E2B secure sandbox integrations
├── deepflow-engine/   # Investor matching engine
└── api/               # Backend API services
```

## MCP Servers (`mcp-servers/`)

Model Context Protocol servers that provide tools and integrations to the chatbot:

- **custom/**: Custom MCP server implementation for the project
- **examples/**: Example MCP servers (weather tools, etc.)

### Available MCP Servers

1. **LinkedIn Scraper** - Network analysis and connection mapping
2. **Notion Integration** - Database and project management
3. **E2B Sandbox** - Secure data processing
4. **Deepflow Engine** - Investor matching

## E2B Sandbox (`e2b-sandbox/`)

Secure sandbox environment for handling sensitive data:

- **investor-db/**: Investor database operations
- **founder-data/**: Founder information processing

### Purpose
E2B provides isolated execution for:
- Sensitive investor database queries
- Founder data processing
- Secure file parsing
- Data validation

## Deepflow Engine (`deepflow-engine/`)

Core investor matching algorithm and database:

- **matching/**: Matching algorithms
- **database/**: Investor database with 10,000+ investors

### Features
- AI-powered relevance scoring
- Multi-criteria matching
- Industry sector analysis
- Investment stage matching
- Geographic preferences
- Portfolio analysis

## API Services (`api/`)

Backend API routes and middleware:

- **routes/**: API endpoint handlers
- **middleware/**: Authentication, validation, logging

## Development

### Running MCP Servers

```bash
# Custom MCP server
cd backend/mcp-servers/custom
npx tsx index.ts
```

### Environment Variables

Required environment variables in `.env`:
```
E2B_API_KEY=your_e2b_api_key
GROQ_API_KEY=your_groq_api_key
```

## Integration with Frontend

The frontend (`src/lib/mcp/`) connects to these backend services via MCP protocol.

## Adding New Services

1. Create new folder in appropriate category
2. Add README.md documenting the service
3. Implement service following MCP protocol
4. Update this README with service details
