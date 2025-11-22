
export enum VideoLength {
  Short = '30 seconds',
  Medium = '45 seconds',
  Long = '60 seconds',
  ExtraLong = '90 seconds',
  DeepDive = '120 seconds'
}

export interface ScriptVariation {
  id: number;
  title: string;
  framework: string;
  hookStrategy: string;
  content: string; // The full script draft
}

export interface FinalScript {
  id?: number; // Added for mapping
  framework?: string; // Added for display
  verbalHook: string;
  visualHook: string;
  onScreenHook: string;
  fullScript: string;
  additionalText: string;
  caption: string;
  hashtags: string[];
  notes: string;
}

export interface ProductState {
  name: string;
  description: string;
  image: string | null; // Base64
  isFaceless: boolean;
}

export enum AppStep {
  Input,
  Researching,
  Drafting,
  Selection,
  Finalizing,
  Result,
  Library, // Added Library Step
  CompetitorReport // Added Competitor Report Step
}

export interface ResearchResult {
  summary: string;
  competitorUrls: string[];
}

// --- LIBRARY TYPES ---

export interface SavedScript {
  id: string;
  title: string;
  productName: string;
  category: string;
  framework: string;
  thumbnail: string | null; 
  dateCreated: string;
  metrics?: {
    views: string;
    ctr: string;
    sales: string;
  };
  content: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  author: string; // "Maddie" or "Industry"
}

// --- COMPETITOR ANALYSIS TYPES ---

export interface CompetitorAnalysis {
  competitorName: string;
  performanceOverview: string;
  successfulPatterns: {
    patternName: string;
    example: string;
    whyItWorks: string;
  }[];
  opportunities: string[];
  differentiationStrategy: string;
  sampleScript: string;
}
