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
}

export enum AppStep {
  Input,
  Researching,
  Drafting,
  Selection,
  Finalizing,
  Result
}

export interface ResearchResult {
  summary: string;
  competitorUrls: string[];
}