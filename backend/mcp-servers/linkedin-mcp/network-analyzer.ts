// LinkedIn Network Path Analyzer

import type {
  LinkedInProfile,
  ConnectionPath,
  NetworkAnalysis,
  NetworkGraph,
} from './types';
import { mockLinkedInData } from './mock-data';

export class LinkedInNetworkAnalyzer {
  private profiles: Map<string, LinkedInProfile>;
  private connections: Map<string, Set<string>>; // profileId -> connected profileIds

  constructor() {
    this.profiles = new Map();
    this.connections = new Map();
    this.loadMockData();
  }

  /**
   * Load mock LinkedIn data
   * In production, this would connect to LinkedIn API
   */
  private loadMockData() {
    for (const profile of mockLinkedInData.profiles) {
      this.profiles.set(profile.id, profile);
    }

    for (const [profileId, connectionIds] of Object.entries(
      mockLinkedInData.connections
    )) {
      this.connections.set(profileId, new Set(connectionIds));
    }
  }

  /**
   * Find connection paths from founder to investor
   */
  async findConnectionPaths(
    founderId: string,
    investorId: string,
    maxDepth = 3
  ): Promise<NetworkAnalysis> {
    const founder = this.profiles.get(founderId);
    const investor = this.profiles.get(investorId);

    if (!founder || !investor) {
      throw new Error('Founder or investor profile not found');
    }

    // BFS to find all paths
    const paths = this.findAllPaths(founderId, investorId, maxDepth);

    if (paths.length === 0) {
      return {
        target: investor.name,
        targetProfile: investor,
        reachable: false,
        alternativePaths: [],
        recommendations: [
          'No direct connection path found within your network',
          'Consider attending events where this investor speaks',
          'Engage with their content on social media',
          'Seek warm introductions through your advisors or other founders',
        ],
      };
    }

    // Sort paths by degree and strength
    paths.sort((a, b) => {
      if (a.degree !== b.degree) return a.degree - b.degree;
      return b.strength - a.strength;
    });

    const bestPath = paths[0];
    const alternativePaths = paths.slice(1, 4); // Top 3 alternatives

    return {
      target: investor.name,
      targetProfile: investor,
      reachable: true,
      bestPath,
      alternativePaths,
      recommendations: this.generateRecommendations(bestPath),
    };
  }

  /**
   * Find all paths between two profiles using BFS
   */
  private findAllPaths(
    startId: string,
    targetId: string,
    maxDepth: number
  ): ConnectionPath[] {
    const paths: ConnectionPath[] = [];
    const queue: { id: string; path: string[] }[] = [
      { id: startId, path: [startId] },
    ];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.path.length > maxDepth + 1) continue;

      if (current.id === targetId && current.path.length > 1) {
        const path = this.buildConnectionPath(current.path);
        paths.push(path);
        continue;
      }

      const connections = this.connections.get(current.id) || new Set();
      for (const connId of connections) {
        if (!current.path.includes(connId)) {
          queue.push({
            id: connId,
            path: [...current.path, connId],
          });
        }
      }
    }

    return paths;
  }

  /**
   * Build a ConnectionPath object from a list of profile IDs
   */
  private buildConnectionPath(profileIds: string[]): ConnectionPath {
    const profiles = profileIds
      .map((id) => this.profiles.get(id))
      .filter((p): p is LinkedInProfile => p !== undefined);

    const target = profiles[profiles.length - 1];
    const intermediaries = profiles.slice(1, -1);

    // Calculate connection strength
    const strength = this.calculatePathStrength(profileIds);

    // Find mutual connections
    const mutualConnections = this.findMutualConnections(
      profileIds[0],
      profileIds[profileIds.length - 1]
    );

    // Generate approach recommendation
    const recommendedApproach = this.generateApproachRecommendation(
      profiles,
      strength
    );

    return {
      target,
      path: profiles,
      degree: profiles.length - 1,
      strength,
      mutualConnections,
      recommendedApproach,
    };
  }

  /**
   * Calculate the strength of a connection path (0-100)
   */
  private calculatePathStrength(profileIds: string[]): number {
    let strength = 100;

    // Reduce strength for each hop
    strength -= (profileIds.length - 2) * 15;

    // Bonus for profiles with many connections (likely well-connected)
    for (const id of profileIds.slice(1, -1)) {
      const profile = this.profiles.get(id);
      if (profile && profile.connections > 500) {
        strength += 10;
      }
    }

    return Math.max(0, Math.min(100, strength));
  }

  /**
   * Find mutual connections between two profiles
   */
  private findMutualConnections(
    profileId1: string,
    profileId2: string
  ): LinkedInProfile[] {
    const connections1 = this.connections.get(profileId1) || new Set();
    const connections2 = this.connections.get(profileId2) || new Set();

    const mutual: LinkedInProfile[] = [];
    for (const id of connections1) {
      if (connections2.has(id)) {
        const profile = this.profiles.get(id);
        if (profile) mutual.push(profile);
      }
    }

    return mutual.slice(0, 5); // Return top 5
  }

  /**
   * Generate approach recommendation based on path
   */
  private generateApproachRecommendation(
    path: LinkedInProfile[],
    strength: number
  ): string {
    if (path.length === 2) {
      return '🎯 **Direct Connection**: Reach out directly via LinkedIn message or email.';
    }

    if (path.length === 3) {
      const intermediary = path[1];
      return `🤝 **One Introduction Away**: Ask ${intermediary.name}${intermediary.company ? ` (${intermediary.company})` : ''} for an introduction. They're directly connected to your target.`;
    }

    if (path.length === 4) {
      const first = path[1];
      const second = path[2];
      return `🔗 **Two-Step Introduction**:
1. First, connect with ${first.name}${first.company ? ` at ${first.company}` : ''}
2. Ask them to introduce you to ${second.name}${second.company ? ` at ${second.company}` : ''}
3. Finally, ${second.name} can introduce you to your target investor`;
    }

    return `📧 **Long Path (${path.length - 1} connections)**: Consider alternative approaches like cold email with strong social proof, or attending events where this investor will be present.`;
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(path: ConnectionPath): string[] {
    const recommendations: string[] = [];

    if (path.degree === 1) {
      recommendations.push(
        'You are directly connected! Send a personalized message explaining your startup and asking for a meeting.'
      );
      recommendations.push(
        'Reference any common interests or mutual connections in your outreach.'
      );
    } else if (path.degree === 2) {
      const intermediary = path.path[1];
      recommendations.push(
        `Reach out to ${intermediary.name} and ask for an introduction.`
      );
      recommendations.push(
        `Prepare a brief 2-3 sentence description of your startup to share with ${intermediary.name}.`
      );
      recommendations.push(
        'Offer to send materials that would make the introduction easy (deck, one-pager).'
      );
    } else {
      recommendations.push(
        `Work through your connection path systematically, starting with ${path.path[1].name}.`
      );
      recommendations.push(
        'Build relationships at each step rather than asking for immediate introductions.'
      );
      recommendations.push(
        'Consider parallel approaches: cold email, social media engagement, events.'
      );
    }

    if (path.mutualConnections.length > 0) {
      recommendations.push(
        `You have ${path.mutualConnections.length} mutual connection(s) including ${path.mutualConnections[0].name} - this strengthens your ask.`
      );
    }

    return recommendations;
  }

  /**
   * Generate network graph visualization data
   */
  async generateNetworkGraph(
    founderId: string,
    investorId: string
  ): Promise<NetworkGraph> {
    const analysis = await this.findConnectionPaths(founderId, investorId);
    const founder = this.profiles.get(founderId)!;
    const investor = this.profiles.get(investorId)!;

    const paths = analysis.bestPath
      ? [analysis.bestPath, ...analysis.alternativePaths]
      : [];

    return {
      founder,
      investor,
      paths,
      shortestPath: analysis.bestPath || paths[0],
      totalPaths: paths.length,
    };
  }

  /**
   * Search for LinkedIn profile by name
   */
  searchProfile(name: string): LinkedInProfile[] {
    const lowerName = name.toLowerCase();
    const results: LinkedInProfile[] = [];

    for (const profile of this.profiles.values()) {
      if (
        profile.name.toLowerCase().includes(lowerName) ||
        profile.company?.toLowerCase().includes(lowerName)
      ) {
        results.push(profile);
      }
    }

    return results;
  }

  /**
   * Get profile by ID
   */
  getProfile(id: string): LinkedInProfile | undefined {
    return this.profiles.get(id);
  }
}
