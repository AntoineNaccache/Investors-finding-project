// Deepflow Matching Algorithm Implementation

import type {
  StartupProfile,
  Investor,
  InvestorMatch,
  MatchResult,
} from './types';

export class DeepflowMatcher {
  private investors: Investor[];

  constructor(investors: Investor[]) {
    this.investors = investors;
  }

  /**
   * Match a startup profile with relevant investors
   */
  async matchInvestors(
    startup: StartupProfile,
    options?: {
      minScore?: number;
      maxResults?: number;
    }
  ): Promise<MatchResult> {
    const minScore = options?.minScore ?? 50;
    const maxResults = options?.maxResults ?? 15;

    const matches: InvestorMatch[] = [];

    for (const investor of this.investors) {
      if (!investor.activelyInvesting) continue;

      const match = this.calculateMatch(startup, investor);

      if (match.score >= minScore) {
        matches.push(match);
      }
    }

    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score);

    // Limit results
    const limitedMatches = matches.slice(0, maxResults);

    return {
      matches: limitedMatches,
      total: limitedMatches.length,
      query: startup,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Calculate match score between startup and investor
   */
  private calculateMatch(
    startup: StartupProfile,
    investor: Investor
  ): InvestorMatch {
    // Calculate individual match scores
    const industryMatch = this.calculateIndustryMatch(startup, investor);
    const stageMatch = this.calculateStageMatch(startup, investor);
    const amountMatch = this.calculateAmountMatch(startup, investor);
    const locationMatch = this.calculateLocationMatch(startup, investor);

    // Weighted scoring
    // Primary criteria: 80% (industry 30%, stage 25%, amount 15%, location 10%)
    // Secondary criteria: 20% (portfolio similarity, etc.)
    const primaryScore =
      industryMatch * 0.3 +
      stageMatch * 0.25 +
      amountMatch * 0.15 +
      locationMatch * 0.1;

    const secondaryScore = this.calculateSecondaryScore(startup, investor);

    const totalScore = Math.round(primaryScore * 0.8 + secondaryScore * 0.2);

    // Generate match reasons
    const reasons = this.generateReasons(
      startup,
      investor,
      industryMatch,
      stageMatch,
      amountMatch,
      locationMatch
    );

    return {
      investor,
      score: totalScore,
      reasons,
      matchDetails: {
        industryMatch,
        stageMatch,
        amountMatch,
        locationMatch,
      },
    };
  }

  /**
   * Calculate industry match score (0-100)
   */
  private calculateIndustryMatch(
    startup: StartupProfile,
    investor: Investor
  ): number {
    // Exact match
    if (investor.focus.includes(startup.industry as any)) {
      return 100;
    }

    // Partial match for related sectors
    const relatedSectors: Record<string, string[]> = {
      'Enterprise SaaS': ['AI/ML', 'Consumer Tech'],
      'Consumer Tech': ['E-commerce', 'AI/ML'],
      FinTech: ['Enterprise SaaS', 'Blockchain'],
      HealthTech: ['AI/ML', 'Enterprise SaaS'],
      'AI/ML': ['Enterprise SaaS', 'HealthTech', 'FinTech'],
    };

    const related = relatedSectors[startup.industry] || [];
    for (const sector of investor.focus) {
      if (related.includes(sector)) {
        return 60;
      }
    }

    return 20; // Minimal match if investor is open to multiple sectors
  }

  /**
   * Calculate funding stage match score (0-100)
   */
  private calculateStageMatch(
    startup: StartupProfile,
    investor: Investor
  ): number {
    // Exact stage match
    if (investor.stages.includes(startup.stage)) {
      return 100;
    }

    // Adjacent stage match (e.g., Seed for Series A startup)
    const stageOrder = [
      'Pre-Seed',
      'Seed',
      'Series A',
      'Series B',
      'Series C',
      'Series C+',
      'Growth Equity',
    ];

    const startupIndex = stageOrder.indexOf(startup.stage);
    const investorIndices = investor.stages.map((s) => stageOrder.indexOf(s));

    // Check if investor invests in adjacent stages
    for (const idx of investorIndices) {
      const diff = Math.abs(startupIndex - idx);
      if (diff === 1) return 70; // One stage away
      if (diff === 2) return 40; // Two stages away
    }

    return 10;
  }

  /**
   * Calculate investment amount match score (0-100)
   */
  private calculateAmountMatch(
    startup: StartupProfile,
    investor: Investor
  ): number {
    const amount = startup.seekingAmount;
    const { min, max } = investor.investmentRange;

    // Perfect fit within range
    if (amount >= min && amount <= max) {
      return 100;
    }

    // Slightly outside range
    if (amount < min && amount >= min * 0.7) return 70;
    if (amount > max && amount <= max * 1.3) return 70;

    // Way outside range
    if (amount < min * 0.5 || amount > max * 2) return 10;

    return 40;
  }

  /**
   * Calculate location match score (0-100)
   */
  private calculateLocationMatch(
    startup: StartupProfile,
    investor: Investor
  ): number {
    // Exact location match
    for (const pref of investor.geographicPreferences) {
      if (
        startup.location.toLowerCase().includes(pref.toLowerCase()) ||
        pref.toLowerCase().includes(startup.location.toLowerCase())
      ) {
        return 100;
      }
    }

    // Regional match
    const regions: Record<string, string[]> = {
      'North America': [
        'US',
        'USA',
        'United States',
        'Canada',
        'San Francisco',
        'New York',
        'Boston',
        'Austin',
        'Seattle',
      ],
      Europe: [
        'UK',
        'London',
        'Berlin',
        'Paris',
        'Amsterdam',
        'Stockholm',
        'Dublin',
      ],
      Asia: [
        'Singapore',
        'Hong Kong',
        'Shanghai',
        'Beijing',
        'Tokyo',
        'Seoul',
        'Bangalore',
      ],
    };

    for (const [region, locations] of Object.entries(regions)) {
      const startupInRegion = locations.some((loc) =>
        startup.location.toLowerCase().includes(loc.toLowerCase())
      );
      const investorPrefersRegion = investor.geographicPreferences.some((pref) =>
        pref.toLowerCase().includes(region.toLowerCase())
      );

      if (startupInRegion && investorPrefersRegion) {
        return 70;
      }
    }

    // Investor prefers global
    if (investor.geographicPreferences.includes('Global')) {
      return 60;
    }

    return 30;
  }

  /**
   * Calculate secondary match criteria (portfolio similarity, technology, etc.)
   */
  private calculateSecondaryScore(
    startup: StartupProfile,
    investor: Investor
  ): number {
    let score = 0;
    let factors = 0;

    // Technology stack alignment
    if (startup.technology && investor.thesis) {
      factors++;
      const techMatch = startup.technology.some((tech) =>
        investor.thesis?.toLowerCase().includes(tech.toLowerCase())
      );
      if (techMatch) score += 80;
    }

    // Growth rate (if available)
    if (startup.growthRate && startup.growthRate > 100) {
      factors++;
      score += 70; // High growth is attractive
    }

    // Default secondary score
    return factors > 0 ? score / factors : 50;
  }

  /**
   * Generate human-readable reasons for the match
   */
  private generateReasons(
    startup: StartupProfile,
    investor: Investor,
    industryMatch: number,
    stageMatch: number,
    amountMatch: number,
    locationMatch: number
  ): string[] {
    const reasons: string[] = [];

    if (industryMatch >= 90) {
      reasons.push(
        `Perfect industry match: ${investor.name} focuses on ${startup.industry}`
      );
    } else if (industryMatch >= 60) {
      reasons.push(
        `Related sector interest: Investor has adjacent focus areas`
      );
    }

    if (stageMatch >= 90) {
      reasons.push(
        `Stage alignment: ${investor.name} actively invests in ${startup.stage}`
      );
    } else if (stageMatch >= 60) {
      reasons.push(
        `Adjacent stage: Investor occasionally invests in ${startup.stage}`
      );
    }

    if (amountMatch >= 90) {
      reasons.push(
        `Investment range fit: $${(startup.seekingAmount / 1_000_000).toFixed(1)}M is within investor's typical range`
      );
    }

    if (locationMatch >= 90) {
      reasons.push(`Geographic match: Investor active in ${startup.location}`);
    }

    if (investor.portfolio.length > 0) {
      reasons.push(
        `Strong portfolio: ${investor.portfolio.length} companies including ${investor.portfolio.slice(0, 2).join(', ')}`
      );
    }

    if (reasons.length === 0) {
      reasons.push('General sector interest and investment criteria alignment');
    }

    return reasons;
  }
}
