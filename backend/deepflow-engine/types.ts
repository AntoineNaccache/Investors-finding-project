// Type definitions for Deepflow matching engine

export interface StartupProfile {
  name?: string;
  industry: string;
  stage: FundingStage;
  seekingAmount: number;
  location: string;
  description: string;
  teamSize?: number;
  revenue?: number;
  growthRate?: number;
  technology?: string[];
  businessModel?: string;
}

export type FundingStage =
  | 'Pre-Seed'
  | 'Seed'
  | 'Series A'
  | 'Series B'
  | 'Series C'
  | 'Series C+'
  | 'Growth Equity';

export type IndustrySector =
  | 'Enterprise SaaS'
  | 'Consumer Tech'
  | 'FinTech'
  | 'HealthTech'
  | 'EdTech'
  | 'E-commerce'
  | 'AI/ML'
  | 'Blockchain'
  | 'CleanTech'
  | 'Hardware/IoT'
  | 'Other';

export interface Investor {
  id: string;
  name: string;
  firm: string;
  title?: string;
  email?: string;
  linkedin?: string;
  focus: IndustrySector[];
  stages: FundingStage[];
  investmentRange: {
    min: number;
    max: number;
  };
  geographicPreferences: string[];
  portfolio: string[];
  thesis?: string;
  activelyInvesting: boolean;
}

export interface InvestorMatch {
  investor: Investor;
  score: number;
  reasons: string[];
  matchDetails: {
    industryMatch: number;
    stageMatch: number;
    amountMatch: number;
    locationMatch: number;
  };
}

export interface MatchResult {
  matches: InvestorMatch[];
  total: number;
  query: StartupProfile;
  timestamp: string;
}
