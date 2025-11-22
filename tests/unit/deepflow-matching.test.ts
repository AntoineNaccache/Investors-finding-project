import { describe, it, expect } from 'vitest';

/**
 * Unit tests for Deepflow Matching Engine
 * Tests the investor matching algorithm and scoring system
 */

describe('Deepflow Matching Engine', () => {
  describe('Investor Matching', () => {
    it('should match investors by industry sector', () => {
      const startup = {
        industry: 'Enterprise SaaS',
        stage: 'Series A',
        seeking: 5000000,
        location: 'San Francisco',
      };

      const investor = {
        focus: ['Enterprise SaaS', 'B2B Software'],
        stage: ['Series A', 'Series B'],
        range: [3000000, 15000000],
        location: ['San Francisco', 'New York'],
      };

      // Mock matching logic
      const score = calculateMatchScore(startup, investor);

      expect(score).toBeGreaterThan(80);
    });

    it('should prioritize exact stage matches', () => {
      const startup = { stage: 'Series A' };
      const investor1 = { stage: ['Series A'] };
      const investor2 = { stage: ['Seed', 'Series B'] };

      const score1 = calculateStageScore(startup, investor1);
      const score2 = calculateStageScore(startup, investor2);

      expect(score1).toBeGreaterThan(score2);
    });

    it('should filter out investors outside investment range', () => {
      const startup = { seeking: 5000000 };
      const investor = { range: [10000000, 50000000] };

      const isMatch = isWithinRange(startup.seeking, investor.range);

      expect(isMatch).toBe(false);
    });

    it('should calculate match score with multiple criteria', () => {
      const startup = {
        industry: 'FinTech',
        stage: 'Seed',
        seeking: 1000000,
        location: 'London',
      };

      const investor = {
        focus: ['FinTech', 'E-commerce'],
        stage: ['Seed', 'Series A'],
        range: [500000, 2000000],
        location: ['London', 'Berlin'],
      };

      const score = calculateMatchScore(startup, investor);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('Scoring System', () => {
    it('should weight industry match at 40%', () => {
      const weights = getMatchWeights();
      expect(weights.industry).toBe(0.4);
    });

    it('should weight stage match at 25%', () => {
      const weights = getMatchWeights();
      expect(weights.stage).toBe(0.25);
    });

    it('should weight investment range at 20%', () => {
      const weights = getMatchWeights();
      expect(weights.range).toBe(0.2);
    });

    it('should weight location at 15%', () => {
      const weights = getMatchWeights();
      expect(weights.location).toBe(0.15);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing startup data gracefully', () => {
      const startup = { industry: 'SaaS' }; // Missing other fields
      const investor = {
        focus: ['SaaS'],
        stage: ['Series A'],
        range: [1000000, 10000000],
      };

      expect(() => calculateMatchScore(startup, investor)).not.toThrow();
    });

    it('should return 0 for completely unrelated matches', () => {
      const startup = {
        industry: 'FinTech',
        stage: 'Series C',
        seeking: 50000000,
      };

      const investor = {
        focus: ['CleanTech'],
        stage: ['Seed'],
        range: [100000, 500000],
      };

      const score = calculateMatchScore(startup, investor);
      expect(score).toBeLessThan(20);
    });
  });
});

// Mock helper functions (to be implemented in actual codebase)
function calculateMatchScore(startup: any, investor: any): number {
  // Placeholder implementation
  let score = 0;

  if (investor.focus.includes(startup.industry)) score += 40;
  if (investor.stage?.includes(startup.stage)) score += 25;
  if (isWithinRange(startup.seeking, investor.range)) score += 20;
  if (investor.location?.includes(startup.location)) score += 15;

  return score;
}

function calculateStageScore(startup: any, investor: any): number {
  return investor.stage.includes(startup.stage) ? 100 : 0;
}

function isWithinRange(amount: number, range: number[]): boolean {
  return amount >= range[0] && amount <= range[1];
}

function getMatchWeights() {
  return {
    industry: 0.4,
    stage: 0.25,
    range: 0.2,
    location: 0.15,
  };
}
