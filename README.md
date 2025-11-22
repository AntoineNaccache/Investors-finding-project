# Investors Finding Project

An AI-powered platform that helps startups find and connect with matching investors through intelligent data analysis and LinkedIn network mapping.

## Overview

This project automates the investor discovery process by analyzing startup documentation, matching founders with relevant investors, and mapping the shortest path through LinkedIn connections to reach those investors.

## Architecture & Workflow

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

## Getting Started

[Installation instructions to be added]

## Configuration

[Configuration details to be added]

## Usage

[Usage instructions to be added]

## Contributing

[Contribution guidelines to be added]

## License

[License information to be added]
