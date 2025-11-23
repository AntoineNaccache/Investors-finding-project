// Deepflow Matching Engine - Main Entry Point

export { DeepflowMatcher } from './matcher';
export { getAllInvestors, getInvestorById, searchInvestors } from './database';
export type {
  StartupProfile,
  Investor,
  InvestorMatch,
  MatchResult,
  FundingStage,
  IndustrySector,
} from './types';

import { DeepflowMatcher } from './matcher';
import { getAllInvestors } from './database';

/**
 * Create a new Deepflow matcher instance with the investor database
 */
export function createMatcher(): DeepflowMatcher {
  const investors = getAllInvestors();
  return new DeepflowMatcher(investors);
}

/**
 * Quick match function for convenience
 */
export async function matchInvestors(
  startup: import('./types').StartupProfile,
  options?: {
    minScore?: number;
    maxResults?: number;
  }
) {
  const matcher = createMatcher();
  return matcher.matchInvestors(startup, options);
}
