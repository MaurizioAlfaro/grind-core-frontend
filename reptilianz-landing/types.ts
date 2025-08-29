import React from 'react';

export interface NFT {
  id: number;
  name: string;
  rarity: number;
  imageUrl: string;
}

export interface RoadmapItem {
  level: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface SocialLink {
  name: string;
  url: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface HowItWorksStep {
  title: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface TokenomicDetail {
    label: string;
    value: string;
    percentage: number;
    color: string;
}

export interface StakingMission {
    id: number;
    title: string;
    description: string;
    rewards: string;
    duration: string;
    status: 'Available' | 'In Progress';
}

export interface DaoProposal {
    id: number;
    title: string;
    status: 'Active' | 'Passed' | 'Failed';
    description: string;
    votesFor: number;
    votesAgainst: number;
}
