// Sample Investor Database
// In production, this would be loaded from PostgreSQL or external API

import type { Investor } from './types';

export const investorDatabase: Investor[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    firm: 'Andreessen Horowitz',
    title: 'Partner',
    email: 'schen@a16z.com',
    linkedin: 'https://linkedin.com/in/sarahchen',
    focus: ['Enterprise SaaS', 'AI/ML'],
    stages: ['Series A', 'Series B'],
    investmentRange: { min: 3_000_000, max: 15_000_000 },
    geographicPreferences: ['North America', 'Europe'],
    portfolio: ['Databricks', 'Notion', 'Figma'],
    thesis:
      'Investing in enterprise software companies transforming how teams collaborate and work',
    activelyInvesting: true,
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    firm: 'Sequoia Capital',
    title: 'General Partner',
    email: 'mrodriguez@sequoiacap.com',
    linkedin: 'https://linkedin.com/in/michaelrodriguez',
    focus: ['FinTech', 'Consumer Tech'],
    stages: ['Seed', 'Series A'],
    investmentRange: { min: 1_000_000, max: 10_000_000 },
    geographicPreferences: ['Global'],
    portfolio: ['Stripe', 'Coinbase', 'Plaid'],
    thesis:
      'Backing founders building the future of financial infrastructure and consumer finance',
    activelyInvesting: true,
  },
  {
    id: '3',
    name: 'Jennifer Liu',
    firm: 'Benchmark',
    title: 'Partner',
    email: 'jliu@benchmark.com',
    linkedin: 'https://linkedin.com/in/jenniferliu',
    focus: ['E-commerce', 'Consumer Tech'],
    stages: ['Series A', 'Series B'],
    investmentRange: { min: 5_000_000, max: 20_000_000 },
    geographicPreferences: ['North America'],
    portfolio: ['Snapchat', 'Uber', 'Instagram'],
    thesis:
      'Investing in consumer platforms that change how people live and interact',
    activelyInvesting: true,
  },
  {
    id: '4',
    name: 'David Park',
    firm: 'Khosla Ventures',
    title: 'Managing Director',
    email: 'dpark@khoslaventures.com',
    linkedin: 'https://linkedin.com/in/davidpark',
    focus: ['HealthTech', 'AI/ML', 'CleanTech'],
    stages: ['Seed', 'Series A', 'Series B'],
    investmentRange: { min: 2_000_000, max: 25_000_000 },
    geographicPreferences: ['North America', 'Europe'],
    portfolio: ['23andMe', 'Impossible Foods', 'Affirm'],
    thesis: 'Supporting breakthrough technologies in health, climate, and AI',
    activelyInvesting: true,
  },
  {
    id: '5',
    name: 'Emma Watson',
    firm: 'Accel Partners',
    title: 'Partner',
    email: 'ewatson@accel.com',
    linkedin: 'https://linkedin.com/in/emmawatson',
    focus: ['Enterprise SaaS', 'Developer Tools'],
    stages: ['Series A', 'Series B', 'Series C'],
    investmentRange: { min: 10_000_000, max: 50_000_000 },
    geographicPreferences: ['North America', 'Europe'],
    portfolio: ['Slack', 'Atlassian', 'UiPath'],
    thesis: 'Investing in developer-first and enterprise infrastructure companies',
    activelyInvesting: true,
  },
  {
    id: '6',
    name: 'James Anderson',
    firm: 'Y Combinator',
    title: 'Partner',
    email: 'janderson@ycombinator.com',
    linkedin: 'https://linkedin.com/in/jamesanderson',
    focus: ['Enterprise SaaS', 'Consumer Tech', 'FinTech', 'HealthTech'],
    stages: ['Pre-Seed', 'Seed'],
    investmentRange: { min: 50_000, max: 500_000 },
    geographicPreferences: ['Global'],
    portfolio: ['Airbnb', 'Dropbox', 'Stripe'],
    thesis: 'Backing ambitious founders at the earliest stages across all sectors',
    activelyInvesting: true,
  },
  {
    id: '7',
    name: 'Priya Patel',
    firm: 'Index Ventures',
    title: 'Partner',
    email: 'ppatel@indexventures.com',
    linkedin: 'https://linkedin.com/in/priyapatel',
    focus: ['FinTech', 'Enterprise SaaS'],
    stages: ['Series A', 'Series B'],
    investmentRange: { min: 5_000_000, max: 30_000_000 },
    geographicPreferences: ['Europe', 'North America'],
    portfolio: ['Revolut', 'TransferWise', 'Adyen'],
    thesis:
      'Partnering with European and global founders building category-defining companies',
    activelyInvesting: true,
  },
  {
    id: '8',
    name: 'Robert Kim',
    firm: 'Lightspeed Venture Partners',
    title: 'General Partner',
    email: 'rkim@lsvp.com',
    linkedin: 'https://linkedin.com/in/robertkim',
    focus: ['AI/ML', 'Enterprise SaaS'],
    stages: ['Seed', 'Series A'],
    investmentRange: { min: 2_000_000, max: 12_000_000 },
    geographicPreferences: ['North America', 'Asia'],
    portfolio: ['Affirm', 'Guardant Health', 'AppDynamics'],
    thesis: 'Investing in next-generation enterprise and AI-first companies',
    activelyInvesting: true,
  },
  {
    id: '9',
    name: 'Lisa Thompson',
    firm: 'Greylock Partners',
    title: 'Partner',
    email: 'lthompson@greylock.com',
    linkedin: 'https://linkedin.com/in/lisathompson',
    focus: ['Consumer Tech', 'Social Media', 'E-commerce'],
    stages: ['Series A', 'Series B'],
    investmentRange: { min: 8_000_000, max: 25_000_000 },
    geographicPreferences: ['North America'],
    portfolio: ['LinkedIn', 'Airbnb', 'Discord'],
    thesis: 'Backing founders creating new consumer experiences and communities',
    activelyInvesting: true,
  },
  {
    id: '10',
    name: 'Alex Johnson',
    firm: 'First Round Capital',
    title: 'Partner',
    email: 'ajohnson@firstround.com',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    focus: ['Enterprise SaaS', 'Developer Tools', 'FinTech'],
    stages: ['Pre-Seed', 'Seed'],
    investmentRange: { min: 100_000, max: 1_000_000 },
    geographicPreferences: ['North America'],
    portfolio: ['Uber', 'Warby Parker', 'Square'],
    thesis: 'Investing in exceptional founders at the earliest stages',
    activelyInvesting: true,
  },
  {
    id: '11',
    name: 'Rachel Green',
    firm: 'NEA (New Enterprise Associates)',
    title: 'General Partner',
    email: 'rgreen@nea.com',
    linkedin: 'https://linkedin.com/in/rachelgreen',
    focus: ['HealthTech', 'FinTech'],
    stages: ['Series A', 'Series B', 'Series C'],
    investmentRange: { min: 10_000_000, max: 50_000_000 },
    geographicPreferences: ['North America', 'Europe'],
    portfolio: ['Robinhood', 'Oscar Health', 'Coursera'],
    thesis: 'Investing in transformative healthcare and financial services companies',
    activelyInvesting: true,
  },
  {
    id: '12',
    name: 'Tom Wilson',
    firm: 'GV (Google Ventures)',
    title: 'Partner',
    email: 'twilson@gv.com',
    linkedin: 'https://linkedin.com/in/tomwilson',
    focus: ['AI/ML', 'Enterprise SaaS', 'HealthTech'],
    stages: ['Series A', 'Series B', 'Series C'],
    investmentRange: { min: 5_000_000, max: 40_000_000 },
    geographicPreferences: ['North America', 'Europe'],
    portfolio: ['Uber', 'Slack', 'Flatiron Health'],
    thesis: 'Backing ambitious teams leveraging AI and technology to transform industries',
    activelyInvesting: true,
  },
  {
    id: '13',
    name: 'Nina Patel',
    firm: 'Insight Partners',
    title: 'Managing Director',
    email: 'npatel@insightpartners.com',
    linkedin: 'https://linkedin.com/in/ninapatel',
    focus: ['Enterprise SaaS', 'E-commerce'],
    stages: ['Series B', 'Series C', 'Growth Equity'],
    investmentRange: { min: 20_000_000, max: 100_000_000 },
    geographicPreferences: ['Global'],
    portfolio: ['Twitter', 'Shopify', 'HelloFresh'],
    thesis: 'Scaling high-growth software and internet businesses globally',
    activelyInvesting: true,
  },
  {
    id: '14',
    name: 'Carlos Martinez',
    firm: 'Tiger Global',
    title: 'Partner',
    email: 'cmartinez@tigerglobal.com',
    linkedin: 'https://linkedin.com/in/carlosmartinez',
    focus: ['FinTech', 'E-commerce', 'Consumer Tech'],
    stages: ['Series B', 'Series C', 'Growth Equity'],
    investmentRange: { min: 25_000_000, max: 150_000_000 },
    geographicPreferences: ['Global'],
    portfolio: ['Stripe', 'Chime', 'Flipkart'],
    thesis: 'Investing in category-leading internet and software companies worldwide',
    activelyInvesting: true,
  },
  {
    id: '15',
    name: 'Sofia Andersson',
    firm: 'Balderton Capital',
    title: 'Partner',
    email: 'sandersson@balderton.com',
    linkedin: 'https://linkedin.com/in/sofiaandersson',
    focus: ['Enterprise SaaS', 'FinTech', 'E-commerce'],
    stages: ['Series A', 'Series B'],
    investmentRange: { min: 5_000_000, max: 20_000_000 },
    geographicPreferences: ['Europe'],
    portfolio: ['Revolut', 'Citymapper', 'GoCardless'],
    thesis: 'Partnering with European entrepreneurs building global businesses',
    activelyInvesting: true,
  },
];

/**
 * Get all investors from database
 */
export function getAllInvestors(): Investor[] {
  return investorDatabase;
}

/**
 * Get investor by ID
 */
export function getInvestorById(id: string): Investor | undefined {
  return investorDatabase.find((inv) => inv.id === id);
}

/**
 * Search investors by name or firm
 */
export function searchInvestors(query: string): Investor[] {
  const lowerQuery = query.toLowerCase();
  return investorDatabase.filter(
    (inv) =>
      inv.name.toLowerCase().includes(lowerQuery) ||
      inv.firm.toLowerCase().includes(lowerQuery)
  );
}
