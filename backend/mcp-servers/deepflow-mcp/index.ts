#!/usr/bin/env node
/**
 * Deepflow MCP Server
 * Provides investor matching functionality via Model Context Protocol
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { matchInvestors, getAllInvestors, searchInvestors } from '../../deepflow-engine';

const server = new McpServer({
  name: 'deepflow-investor-matcher',
  version: '1.0.0',
});

// Tool: Match investors for a startup
server.tool(
  'match_investors',
  {
    startupName: z.string().optional(),
    industry: z.string().describe('Industry sector of the startup'),
    stage: z
      .enum([
        'Pre-Seed',
        'Seed',
        'Series A',
        'Series B',
        'Series C',
        'Series C+',
        'Growth Equity',
      ])
      .describe('Current funding stage'),
    seekingAmount: z.number().describe('Amount seeking to raise in dollars'),
    location: z.string().describe('Geographic location'),
    description: z.string().describe('Brief description of the startup'),
    teamSize: z.number().optional(),
    revenue: z.number().optional(),
    growthRate: z.number().optional(),
    technology: z.array(z.string()).optional(),
    businessModel: z.string().optional(),
    minScore: z.number().optional().describe('Minimum match score (0-100)'),
    maxResults: z.number().optional().describe('Maximum number of results'),
  },
  {
    title: 'Match Investors',
    description:
      'Find and match investors with a startup based on industry, stage, amount, and location',
  },
  async ({
    startupName,
    industry,
    stage,
    seekingAmount,
    location,
    description,
    teamSize,
    revenue,
    growthRate,
    technology,
    businessModel,
    minScore,
    maxResults,
  }) => {
    try {
      const result = await matchInvestors(
        {
          name: startupName,
          industry,
          stage,
          seekingAmount,
          location,
          description,
          teamSize,
          revenue,
          growthRate,
          technology,
          businessModel,
        },
        { minScore, maxResults }
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error matching investors: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get all investors
server.tool(
  'get_all_investors',
  {},
  {
    title: 'Get All Investors',
    description: 'Retrieve the complete list of investors in the database',
  },
  async () => {
    try {
      const investors = getAllInvestors();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                total: investors.length,
                investors: investors.slice(0, 20), // Limit to first 20 for readability
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting investors: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Search investors
server.tool(
  'search_investors',
  {
    query: z.string().describe('Search query for investor name or firm'),
  },
  {
    title: 'Search Investors',
    description: 'Search for investors by name or firm',
  },
  async ({ query }) => {
    try {
      const investors = searchInvestors(query);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                query,
                results: investors.length,
                investors,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error searching investors: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Deepflow MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
