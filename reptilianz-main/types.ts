import React from "react";
import { PublicKey } from "@solana/web3.js";

export interface NFT {
  id: number;
  name: string;
  rarity: number;
  imageUrl: string;
}

export interface NftAttribute {
  trait_type: string;
  value: string;
}

export interface NftDetails {
  name: string;
  description: string;
  image: string;
  attributes: NftAttribute[];
}

export interface RoadmapItem {
  level: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
}

export interface SocialLink {
  name: string;
  url: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface ProtocolStep {
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
  status: "Available" | "In Progress";
}

export interface DaoProposal {
  id: number;
  title: string;
  status: "Active" | "Passed" | "Failed";
  description: string;
  votesFor: number;
  votesAgainst: number;
}

// Generic Solana wallet provider interface
export interface SolanaWalletProvider {
  name: string;
  icon: string;
  isAvailable: boolean;
  connect: (options?: {
    onlyIfTrusted: boolean;
  }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (args: any) => void) => void;
  off: (event: string, callback: (args: any) => void) => void;
  request: (method: string, params: any) => Promise<any>;
}

// Define the structure of the Phantom wallet provider injected into the window object.
export interface PhantomProvider {
  isPhantom: boolean;
  publicKey: PublicKey | null;
  connect: (options?: {
    onlyIfTrusted: boolean;
  }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (args: any) => void) => void;
  off: (event: string, callback: (args: any) => void) => void;
  request: (method: string, params: any) => Promise<any>;
}

// Wallet provider configuration
export interface WalletProviderConfig {
  name: string;
  icon: React.ReactNode;
  description: string;
  getProvider: () => any;
  isAvailable: () => boolean;
}
