
import { VideoLength } from "../types";

// --- DATA TYPES ---

export type ProductCategory = 'fashion' | 'beauty' | 'home' | 'tech' | 'pet' | 'fitness' | 'general';

export interface ViralScriptEntry {
  id: string;
  category: ProductCategory;
  productName: string;
  scriptText: string;
  metrics: {
    views: string;
    completionRate: string;
    sales: string;
  };
  framework: string;
  tags: string[];
}

export interface VoicePattern {
  id: string;
  category: 'phrase' | 'vocabulary' | 'structure' | 'tone';
  pattern: string;
  usageContext: string;
}

export interface CompetitorInsight {
  id: string;
  category: ProductCategory;
  insight: string;
  trendStatus: 'emerging' | 'peak' | 'declining';
}

export interface HookEntry {
  id: string;
  text: string;
  type: 'verbal' | 'visual' | 'text_overlay';
  category: ProductCategory | 'universal';
  performanceTier: 'viral' | 'high' | 'proven';
}

// --- MOCK DATABASES ---

const MADDIE_VOICE_DB: VoicePattern[] = [
  { id: 'v1', category: 'phrase', pattern: "Run don't walk", usageContext: "High urgency, stock warnings" },
  { id: 'v2', category: 'phrase', pattern: "I am literally obsessed", usageContext: "Authentic product endorsement" },
  { id: 'v3', category: 'vocabulary', pattern: "Buttery soft", usageContext: "Fabric/clothing description" },
  { id: 'v4', category: 'vocabulary', pattern: "It's giving luxury", usageContext: "Comparing affordable to expensive" },
  { id: 'v5', category: 'structure', pattern: "Start with a close-up texture shot then pull back", usageContext: "Visual hook strategy" },
  { id: 'v6', category: 'tone', pattern: "Bestie advice / Facetime with a friend", usageContext: "General delivery style" },
  { id: 'v7', category: 'phrase', pattern: "My husband is sick of me talking about this", usageContext: "Relationship relatability" },
  { id: 'v8', category: 'phrase', pattern: "If you're a [X] size girly like me", usageContext: "Inclusivity/Relatability" }
];

const VIRAL_SCRIPTS_DB: ViralScriptEntry[] = [
  {
    id: 'vs1',
    category: 'fashion',
    productName: 'Shapewear Bodysuit',
    scriptText: "I stopped wearing bras completely. Look at this lift. This is the viral bodysuit from [Brand] and I get why it's sold out 5 times.",
    metrics: { views: '4.2M', completionRate: '68%', sales: '15k+' },
    framework: 'Problem-Solution',
    tags: ['clothing', 'shapewear', 'fashion', 'comfort']
  },
  {
    id: 'vs2',
    category: 'home',
    productName: 'Motion Sensor Light',
    scriptText: "My landlord won't let me install lights so I bought these. They stick on magnetically and look so expensive. Watch this motion detection.",
    metrics: { views: '8.9M', completionRate: '72%', sales: '40k+' },
    framework: 'PAS (Problem-Agitate-Solution)',
    tags: ['home decor', 'renter friendly', 'lighting', 'gadget']
  },
  {
    id: 'vs3',
    category: 'beauty',
    productName: 'Snail Mucin Essence',
    scriptText: "If your makeup looks cakey, it's not your foundation, it's your hydration. I added this one step and look at the glow. It's literally glass skin.",
    metrics: { views: '2.1M', completionRate: '65%', sales: '12k+' },
    framework: 'Educational/Routine',
    tags: ['skincare', 'makeup', 'hydration', 'beauty']
  }
];

const HOOKS_DB: HookEntry[] = [
  { id: 'h1', text: "I wish I knew about this in my 20s", type: 'verbal', category: 'beauty', performanceTier: 'viral' },
  { id: 'h2', text: "Stop wasting money on [Competitor]", type: 'verbal', category: 'general', performanceTier: 'high' },
  { id: 'h3', text: "POV: You finally found the perfect [Product]", type: 'text_overlay', category: 'general', performanceTier: 'proven' },
  { id: 'h4', text: "TikTok made me buy it and I'm not even mad", type: 'verbal', category: 'general', performanceTier: 'proven' },
  { id: 'h5', text: "This is your sign to upgrade your [Item]", type: 'verbal', category: 'home', performanceTier: 'high' },
  { id: 'h6', text: "[Visual] Aggressively shaking head 'No' then nodding 'Yes' with product", type: 'visual', category: 'universal', performanceTier: 'viral' }
];

const COMPETITOR_DB: CompetitorInsight[] = [
  { id: 'c1', category: 'fashion', insight: "Try-on hauls performed 30% better when showing sizing chart on screen.", trendStatus: 'peak' },
  { id: 'c2', category: 'beauty', insight: "Texture close-ups (macro shots) are currently outperforming face-talking videos.", trendStatus: 'emerging' },
  { id: 'c3', category: 'home', insight: "ASMR unboxing sounds are critical for retention in Q4 2024.", trendStatus: 'peak' }
];

// --- RETRIEVAL LOGIC ---

// Simple keyword matching helper
const calculateRelevance = (text: string, query: string): number => {
  const queryTerms = query.toLowerCase().split(' ');
  const targetText = text.toLowerCase();
  return queryTerms.reduce((score, term) => {
    return score + (targetText.includes(term) ? 1 : 0);
  }, 0);
};

const detectCategory = (query: string): ProductCategory => {
  const q = query.toLowerCase();
  if (q.includes('dress') || q.includes('shirt') || q.includes('wear') || q.includes('fit')) return 'fashion';
  if (q.includes('skin') || q.includes('hair') || q.includes('makeup') || q.includes('balm')) return 'beauty';
  if (q.includes('clean') || q.includes('decor') || q.includes('kitchen') || q.includes('room')) return 'home';
  if (q.includes('dog') || q.includes('cat') || q.includes('pet')) return 'pet';
  if (q.includes('phone') || q.includes('charger') || q.includes('tech')) return 'tech';
  return 'general';
};

export const retrieveContext = (productName: string, description: string) => {
  const query = `${productName} ${description}`;
  const category = detectCategory(query);

  // 1. Retrieve Voice Patterns (Universal + Category hints)
  // For Maddie's voice, we mostly return all of them as they define the persona, 
  // but we prioritize ones that fit the context.
  const voicePatterns = MADDIE_VOICE_DB.map(p => ({
    ...p,
    relevance: calculateRelevance(p.usageContext, query)
  })).sort((a, b) => b.relevance - a.relevance).slice(0, 5);

  // 2. Retrieve Viral Scripts (Similarity Search)
  const viralScripts = VIRAL_SCRIPTS_DB.map(s => ({
    ...s,
    relevance: (s.category === category ? 5 : 0) + calculateRelevance(s.tags.join(' '), query)
  })).filter(s => s.relevance > 0).sort((a, b) => b.relevance - a.relevance).slice(0, 2);

  // 3. Retrieve Hooks
  const hooks = HOOKS_DB.filter(h => h.category === category || h.category === 'universal' || h.category === 'general')
    .sort(() => 0.5 - Math.random()) // Randomize slightly for variety
    .slice(0, 4);

  // 4. Retrieve Competitor Insights
  const insights = COMPETITOR_DB.filter(c => c.category === category);

  return {
    category,
    voicePatterns,
    viralScripts,
    hooks,
    insights
  };
};
