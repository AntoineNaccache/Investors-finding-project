// LinkedIn Network Types

export interface LinkedInProfile {
  id: string;
  name: string;
  title?: string;
  company?: string;
  location?: string;
  linkedinUrl: string;
  connections: number;
}

export interface Connection {
  profile: LinkedInProfile;
  degree: 1 | 2 | 3; // 1st, 2nd, or 3rd degree connection
  mutualConnections?: LinkedInProfile[];
}

export interface ConnectionPath {
  target: LinkedInProfile;
  path: LinkedInProfile[];
  degree: number;
  strength: number; // 0-100 score for connection strength
  mutualConnections: LinkedInProfile[];
  recommendedApproach: string;
}

export interface NetworkGraph {
  founder: LinkedInProfile;
  investor: LinkedInProfile;
  paths: ConnectionPath[];
  shortestPath: ConnectionPath;
  totalPaths: number;
}

export interface NetworkAnalysis {
  target: string;
  targetProfile: LinkedInProfile;
  reachable: boolean;
  bestPath?: ConnectionPath;
  alternativePaths: ConnectionPath[];
  recommendations: string[];
}
