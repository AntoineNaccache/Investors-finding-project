// Mock LinkedIn Data for Testing
// In production, this would be replaced with actual LinkedIn API calls

import type { LinkedInProfile } from './types';

export const mockLinkedInData = {
  profiles: [
    // Founder
    {
      id: 'founder1',
      name: 'John Founder',
      title: 'CEO & Co-founder',
      company: 'TechStartup Inc.',
      location: 'San Francisco, CA',
      linkedinUrl: 'https://linkedin.com/in/johnfounder',
      connections: 850,
    },

    // Direct connections (1st degree)
    {
      id: 'advisor1',
      name: 'Maria Advisor',
      title: 'Startup Advisor',
      company: 'Independent',
      location: 'San Francisco, CA',
      linkedinUrl: 'https://linkedin.com/in/mariaadvisor',
      connections: 1200,
    },
    {
      id: 'founder2',
      name: 'Alex Fellow-Founder',
      title: 'CEO',
      company: 'Another Startup',
      location: 'San Francisco, CA',
      linkedinUrl: 'https://linkedin.com/in/alexfounder',
      connections: 950,
    },
    {
      id: 'engineer1',
      name: 'Sam Engineer',
      title: 'Senior Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      linkedinUrl: 'https://linkedin.com/in/samengineer',
      connections: 600,
    },

    // 2nd degree connections
    {
      id: 'vc1',
      name: 'Sarah Chen',
      title: 'Partner',
      company: 'Andreessen Horowitz',
      location: 'Menlo Park, CA',
      linkedinUrl: 'https://linkedin.com/in/sarahchen',
      connections: 2500,
    },
    {
      id: 'vc2',
      name: 'Michael Rodriguez',
      title: 'General Partner',
      company: 'Sequoia Capital',
      location: 'Menlo Park, CA',
      linkedinUrl: 'https://linkedin.com/in/michaelrodriguez',
      connections: 3200,
    },
    {
      id: 'executive1',
      name: 'Lisa Executive',
      title: 'VP Product',
      company: 'Stripe',
      location: 'San Francisco, CA',
      linkedinUrl: 'https://linkedin.com/in/lisaexecutive',
      connections: 1800,
    },

    // 3rd degree connections
    {
      id: 'vc3',
      name: 'David Park',
      title: 'Managing Director',
      company: 'Khosla Ventures',
      location: 'Menlo Park, CA',
      linkedinUrl: 'https://linkedin.com/in/davidpark',
      connections: 2100,
    },
    {
      id: 'vc4',
      name: 'Emma Watson',
      title: 'Partner',
      company: 'Accel Partners',
      location: 'Palo Alto, CA',
      linkedinUrl: 'https://linkedin.com/in/emmawatson',
      connections: 2800,
    },

    // Intermediaries
    {
      id: 'connector1',
      name: 'Bob Connector',
      title: 'Investment Partner',
      company: 'Venture Network',
      location: 'San Francisco, CA',
      linkedinUrl: 'https://linkedin.com/in/bobconnector',
      connections: 1500,
    },
    {
      id: 'mentor1',
      name: 'Jane Mentor',
      title: 'CEO',
      company: 'Successful Startup',
      location: 'San Francisco, CA',
      linkedinUrl: 'https://linkedin.com/in/janementor',
      connections: 2200,
    },
  ] as LinkedInProfile[],

  // Connection graph: profileId -> array of connected profileIds
  connections: {
    // Founder's connections
    founder1: ['advisor1', 'founder2', 'engineer1'],

    // Advisor's connections (connects founder to VCs)
    advisor1: ['founder1', 'vc1', 'vc2', 'executive1', 'connector1'],

    // Fellow founder's connections
    founder2: ['founder1', 'executive1', 'mentor1'],

    // Engineer's connections
    engineer1: ['founder1', 'executive1'],

    // VCs' connections (target investors)
    vc1: ['advisor1', 'connector1', 'vc3', 'vc4'],
    vc2: ['advisor1', 'mentor1', 'vc3'],

    // Executives
    executive1: ['advisor1', 'founder2', 'engineer1', 'vc2', 'mentor1'],

    // Intermediaries
    connector1: ['advisor1', 'vc1', 'vc4', 'mentor1'],
    mentor1: ['founder2', 'executive1', 'vc2', 'connector1', 'vc3', 'vc4'],

    // 3rd degree VCs
    vc3: ['vc1', 'vc2', 'mentor1'],
    vc4: ['vc1', 'connector1', 'mentor1'],
  } as Record<string, string[]>,
};

/**
 * Example paths in this network:
 *
 * Founder -> Sarah Chen (vc1):
 *   Path 1: Founder -> Advisor -> Sarah Chen (2 hops)
 *   Path 2: Founder -> Advisor -> Connector -> Sarah Chen (3 hops)
 *
 * Founder -> Michael Rodriguez (vc2):
 *   Path 1: Founder -> Advisor -> Michael Rodriguez (2 hops)
 *   Path 2: Founder -> Fellow Founder -> Executive -> Michael Rodriguez (3 hops)
 *
 * Founder -> David Park (vc3):
 *   Path 1: Founder -> Advisor -> Sarah Chen -> David Park (3 hops)
 *   Path 2: Founder -> Fellow Founder -> Mentor -> David Park (3 hops)
 *
 * Founder -> Emma Watson (vc4):
 *   Path 1: Founder -> Advisor -> Connector -> Emma Watson (3 hops)
 *   Path 2: Founder -> Fellow Founder -> Mentor -> Emma Watson (3 hops)
 */
