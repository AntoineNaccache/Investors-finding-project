#!/usr/bin/env node
/**
 * LinkedIn Network MCP Server
 * Provides LinkedIn network analysis and connection path finding via MCP
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { LinkedInNetworkAnalyzer } from './network-analyzer';

const server = new McpServer({
  name: 'linkedin-network-analyzer',
  version: '1.0.0',
});

const analyzer = new LinkedInNetworkAnalyzer();

// Tool: Find connection path to investor
server.tool(
  'find_connection_path',
  {
    founderId: z.string().describe('LinkedIn profile ID of the founder'),
    investorId: z.string().describe('LinkedIn profile ID of the investor'),
    maxDepth: z
      .number()
      .optional()
      .describe('Maximum connection depth to search (default: 3)'),
  },
  {
    title: 'Find Connection Path',
    description:
      'Find the shortest path from a founder to an investor through LinkedIn connections',
  },
  async ({ founderId, investorId, maxDepth }) => {
    try {
      const analysis = await analyzer.findConnectionPaths(
        founderId,
        investorId,
        maxDepth || 3
      );

      const resultText = formatNetworkAnalysis(analysis);

      return {
        content: [
          {
            type: 'text',
            text: resultText,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error finding connection path: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Search LinkedIn profile
server.tool(
  'search_linkedin_profile',
  {
    name: z.string().describe('Name or company to search for'),
  },
  {
    title: 'Search LinkedIn Profile',
    description: 'Search for LinkedIn profiles by name or company',
  },
  async ({ name }) => {
    try {
      const profiles = analyzer.searchProfile(name);

      if (profiles.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No profiles found for "${name}"`,
            },
          ],
        };
      }

      const resultText = profiles
        .map(
          (p) =>
            `• ${p.name}${p.title ? ` - ${p.title}` : ''}${p.company ? ` at ${p.company}` : ''}\n  ID: ${p.id}\n  Connections: ${p.connections}`
        )
        .join('\n\n');

      return {
        content: [
          {
            type: 'text',
            text: `Found ${profiles.length} profile(s):\n\n${resultText}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error searching profile: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Generate network visualization
server.tool(
  'generate_network_graph',
  {
    founderId: z.string().describe('LinkedIn profile ID of the founder'),
    investorId: z.string().describe('LinkedIn profile ID of the investor'),
  },
  {
    title: 'Generate Network Graph',
    description:
      'Generate a network graph showing connection paths between founder and investor',
  },
  async ({ founderId, investorId }) => {
    try {
      const graph = await analyzer.generateNetworkGraph(founderId, investorId);

      const resultText = formatNetworkGraph(graph);

      return {
        content: [
          {
            type: 'text',
            text: resultText,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error generating network graph: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get recommended outreach strategy
server.tool(
  'get_outreach_strategy',
  {
    founderId: z.string().describe('LinkedIn profile ID of the founder'),
    investorId: z.string().describe('LinkedIn profile ID of the investor'),
  },
  {
    title: 'Get Outreach Strategy',
    description:
      'Get a personalized outreach strategy to connect with an investor',
  },
  async ({ founderId, investorId }) => {
    try {
      const analysis = await analyzer.findConnectionPaths(founderId, investorId);

      const strategy = generateOutreachStrategy(analysis);

      return {
        content: [
          {
            type: 'text',
            text: strategy,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error generating outreach strategy: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Helper function to format network analysis
function formatNetworkAnalysis(
  analysis: import('./types').NetworkAnalysis
): string {
  let result = `# Connection Path to ${analysis.target}\n\n`;

  if (!analysis.reachable) {
    result += '❌ **Not Reachable**: No direct path found in your network.\n\n';
    result += '## Recommendations:\n';
    for (const rec of analysis.recommendations) {
      result += `• ${rec}\n`;
    }
    return result;
  }

  result += '✅ **Reachable**: Connection path found!\n\n';

  // Best path
  if (analysis.bestPath) {
    result += '## 🎯 Recommended Path:\n\n';
    result += `**Degree**: ${analysis.bestPath.degree} ${analysis.bestPath.degree === 1 ? 'hop' : 'hops'}\n`;
    result += `**Strength**: ${analysis.bestPath.strength}/100\n\n`;

    result += '**Path**:\n';
    for (let i = 0; i < analysis.bestPath.path.length; i++) {
      const person = analysis.bestPath.path[i];
      result += `${i + 1}. ${person.name}`;
      if (person.title && person.company) {
        result += ` - ${person.title} at ${person.company}`;
      } else if (person.title) {
        result += ` - ${person.title}`;
      } else if (person.company) {
        result += ` - ${person.company}`;
      }
      result += '\n';
    }

    result += `\n${analysis.bestPath.recommendedApproach}\n\n`;

    if (analysis.bestPath.mutualConnections.length > 0) {
      result += '**Mutual Connections**:\n';
      for (const mutual of analysis.bestPath.mutualConnections) {
        result += `• ${mutual.name}${mutual.company ? ` (${mutual.company})` : ''}\n`;
      }
      result += '\n';
    }
  }

  // Alternative paths
  if (analysis.alternativePaths.length > 0) {
    result += '## 🔄 Alternative Paths:\n\n';
    for (const [idx, path] of analysis.alternativePaths.entries()) {
      result += `### Option ${idx + 2}:\n`;
      result += `**Degree**: ${path.degree} hops | **Strength**: ${path.strength}/100\n`;
      result += '**Route**: ';
      result += path.path.map((p) => p.name).join(' → ');
      result += '\n\n';
    }
  }

  // Recommendations
  result += '## 💡 Recommendations:\n\n';
  for (const rec of analysis.recommendations) {
    result += `• ${rec}\n`;
  }

  return result;
}

// Helper function to format network graph
function formatNetworkGraph(graph: import('./types').NetworkGraph): string {
  let result = `# Network Graph: ${graph.founder.name} → ${graph.investor.name}\n\n`;

  result += `**Total Paths Found**: ${graph.totalPaths}\n\n`;

  if (graph.shortestPath) {
    result += `**Shortest Path**: ${graph.shortestPath.degree} ${graph.shortestPath.degree === 1 ? 'hop' : 'hops'}\n\n`;
  }

  result += '## Network Visualization:\n\n';
  result += '```\n';

  // ASCII network diagram
  for (const [idx, path] of graph.paths.entries()) {
    if (idx >= 5) break; // Show top 5 paths

    result += `Path ${idx + 1} (${path.degree} hops):\n`;
    result += graph.founder.name;

    for (let i = 1; i < path.path.length; i++) {
      result += ` → ${path.path[i].name}`;
    }
    result += '\n\n';
  }

  result += '```\n';

  return result;
}

// Helper function to generate outreach strategy
function generateOutreachStrategy(
  analysis: import('./types').NetworkAnalysis
): string {
  let strategy = `# Outreach Strategy for ${analysis.target}\n\n`;

  if (!analysis.reachable) {
    strategy += '## 🎯 Cold Outreach Approach\n\n';
    strategy +=
      'Since you\'re not connected through LinkedIn, here\'s a multi-channel approach:\n\n';
    strategy += '### 1. LinkedIn Cold Message\n';
    strategy +=
      '- Keep it brief (2-3 sentences)\n- Lead with value/traction\n- Specific ask for 15-minute call\n\n';
    strategy += '### 2. Email Outreach\n';
    strategy += '- Find email using hunter.io or RocketReach\n- Strong subject line\n- Include pitch deck link\n\n';
    strategy += '### 3. Social Proof\n';
    strategy +=
      '- Engage with their posts/content first\n- Get customer testimonials\n- Highlight notable advisors/investors\n\n';
    return strategy;
  }

  strategy += '## 🎯 Warm Introduction Strategy\n\n';

  if (analysis.bestPath) {
    strategy += `You're **${analysis.bestPath.degree} ${analysis.bestPath.degree === 1 ? 'connection' : 'connections'}** away!\n\n`;

    if (analysis.bestPath.degree === 1) {
      strategy += '### Direct Approach:\n';
      strategy += '1. **Prepare Your Materials**\n';
      strategy += '   - Update your pitch deck\n';
      strategy += '   - Prepare 2-3 sentence elevator pitch\n';
      strategy += '   - Have key metrics ready\n\n';
      strategy += '2. **Craft Your Message**\n';
      strategy += '   - Personalize based on their portfolio\n';
      strategy += '   - Reference specific companies they\'ve backed\n';
      strategy += '   - Clear ask: "Would love 15 minutes to share what we\'re building"\n\n';
      strategy += '3. **Send on LinkedIn or Email**\n';
      strategy +=
        '   - Mid-week, mid-morning typically best\n   - Follow up once after 5-7 days if no response\n\n';
    } else {
      const connector = analysis.bestPath.path[1];
      strategy += '### Step-by-Step Approach:\n\n';
      strategy += `1. **Reach out to ${connector.name}**\n`;
      strategy += '   - Context: "Would love your help connecting with [Investor]"\n';
      strategy += '   - Why: Briefly explain why this investor is a fit\n';
      strategy +=
        '   - Make it easy: Offer to draft the intro email\n\n';
      strategy += '2. **Prepare Introduction Materials**\n';
      strategy += '   - One-pager or deck\n';
      strategy += '   - 2-3 sentence blurb for the intro\n';
      strategy += '   - Recent traction/wins\n\n';
      strategy += '3. **After Introduction**\n';
      strategy += '   - Respond within 24 hours\n';
      strategy += '   - Suggest specific times for call\n';
      strategy += '   - Thank the introducer\n\n';
    }

    if (analysis.bestPath.mutualConnections.length > 0) {
      strategy += `### 💪 Leverage Your ${analysis.bestPath.mutualConnections.length} Mutual Connection(s):\n\n`;
      for (const mutual of analysis.bestPath.mutualConnections) {
        strategy += `• ${mutual.name}${mutual.company ? ` at ${mutual.company}` : ''}\n`;
      }
      strategy += '\nMention these shared connections in your outreach!\n\n';
    }
  }

  strategy += '## ✉️ Sample Message Template:\n\n';
  strategy += '```\n';
  if (analysis.bestPath && analysis.bestPath.degree === 1) {
    strategy += 'Hi [Investor Name],\n\n';
    strategy +=
      'I\'m building [Company] - we\'re [one-line description]. We just [recent traction/milestone].\n\n';
    strategy +=
      'I saw you invested in [portfolio company] and thought our approach to [problem] might interest you. Would love 15 minutes to share what we\'re building.\n\n';
    strategy += 'Best,\n[Your Name]\n';
  } else if (analysis.bestPath) {
    const connector = analysis.bestPath.path[1];
    strategy += `Hi ${connector.name},\n\n`;
    strategy +=
      'Hope you\'re doing well! I\'m reaching out because I\'d love your help connecting with [Investor Name].\n\n';
    strategy +=
      'We\'re building [Company] - [one-line description]. We just [recent traction], and [Investor] would be a perfect fit given their focus on [sector] and investments in [portfolio company].\n\n';
    strategy +=
      'Happy to send over a deck and draft an intro email if you\'re comfortable making the connection.\n\n';
    strategy += 'Thanks!\n[Your Name]\n';
  }
  strategy += '```\n\n';

  strategy += '## ⏰ Timeline:\n\n';
  strategy += '- **Week 1**: Prepare materials, reach out to connector\n';
  strategy += '- **Week 2**: Get introduction, respond promptly\n';
  strategy += '- **Week 3**: Initial meeting with investor\n';
  strategy += '- **Week 4**: Follow-up and next steps\n';

  return strategy;
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('LinkedIn Network MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
