

// --- DATA TYPES ---

export type ProductCategory = 'fashion' | 'beauty' | 'home' | 'tech' | 'pet' | 'fitness' | 'general';

export interface VoiceProfile {
  characteristics: string[];
  languagePatterns: {
    mustUse: string[];
    avoid: string[];
  };
  structureRules: string[];
}

export interface HookCategory {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

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

export interface CompetitorInsight {
  id: string;
  category: ProductCategory;
  insight: string;
  trendStatus: 'emerging' | 'peak' | 'declining';
}

// --- KNOWLEDGE BASE FROM MARKDOWN FILES ---

const MADDIE_DNA: VoiceProfile = {
  characteristics: [
    "Approachable Expert: Speaks as a friend who found something great, not an influencer.",
    "Detail-Oriented: Leads with fit, sizing, and technical specs (hem, inseam, material).",
    "Solution-Focused: Always addresses a specific problem (tall girl friendly, tummy control).",
    "Authentically Enthusiastic: Uses natural reactions like 'Okay but hear me out'.",
    "Age-Appropriate: 29-year-old speaking to 30-55 demographic. No Gen Z slang, no corporate jargon."
  ],
  languagePatterns: {
    mustUse: [
      "Run don't walk",
      "I am literally obsessed",
      "Okay but hear me out...",
      "I wasn't expecting this but...",
      "True to size ladies",
      "The hem is perfect for...",
      "Tall girls, this is for you",
      "These are gonna sell out and I'm not even sorry",
      "I sized up for an oversized fit",
      "Tummy control without being restrictive",
      "Buttery soft",
      "It's giving luxury",
      "A whole outfit"
    ],
    avoid: [
      "Game-changer",
      "Revolutionary",
      "Click the link below",
      "Buy now",
      "OMG you NEED this",
      "This product features..."
    ]
  },
  structureRules: [
    "0-3s: Natural hook establishing relatability or specific pain point.",
    "4-15s: KEY FIT DETAILS FIRST. Inseam, waist fit, material feel. Don't bury the lead.",
    "16-28s: Versatility and Solutions. Where can I wear this? How does it wash?",
    "29-30s: Soft CTA. 'Link in bio', 'Grab yours before it sells out'."
  ]
};

const MASTER_HOOKS_DB: HookCategory[] = [
  {
    id: 'curiosity',
    name: 'Curiosity-Driven',
    description: 'Spark interest to make them watch more.',
    examples: [
      "You’ll never guess what happens next…",
      "The secret to [result] is simpler than you think…",
      "I was today years old when I learned this…",
      "Here’s a trick that nobody tells you about [topic]…"
    ]
  },
  {
    id: 'shock',
    name: 'Shock Value',
    description: 'Surprise and instant attention.',
    examples: [
      "I can’t believe this happened…",
      "This video will change everything you thought you knew about [topic]…",
      "Wait until you see what happens next…",
      "This is so unbelievable, but it’s true…"
    ]
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    description: 'Narrative start.',
    examples: [
      "This is the story of how I [achieved result]…",
      "I was in a tough spot, and here’s how I got out of it…",
      "This one decision changed my life forever…",
      "It all started when I decided to [action]…"
    ]
  },
  {
    id: 'problem_solving',
    name: 'Problem-Solving',
    description: 'Directly address a pain point.',
    examples: [
      "Struggling with [issue]? Here’s how to fix it…",
      "I used to [struggle] until I found this solution…",
      "Stop doing [wrong thing], and start doing this instead…",
      "I finally found the solution to [common problem]…"
    ]
  },
  {
    id: 'educational',
    name: 'Educational',
    description: 'Teach something valuable quickly.',
    examples: [
      "Here’s how to [result] in just 60 seconds…",
      "You won’t believe how easy it is to [learn skill]…",
      "This hack will save you so much time…",
      "You’re doing [task] wrong—here’s how to do it right…"
    ]
  },
  {
    id: 'question',
    name: 'Question-Based',
    description: 'Prompt thinking.',
    examples: [
      "Have you ever wondered why [event happens]?",
      "Is it just me, or does [situation] happen to everyone?",
      "Do you know the secret to [result]?",
      "Are you making this mistake with [task]?"
    ]
  },
  {
    id: 'list',
    name: 'List-Based',
    description: 'Promise quick insights.',
    examples: [
      "5 things you didn’t know about [topic]…",
      "Top 3 ways to [achieve goal]…",
      "3 things you need to stop doing right now…",
      "The ultimate checklist for [task]…"
    ]
  },
  {
    id: 'controversial',
    name: 'Controversial Opinion',
    description: 'Spark debate.',
    examples: [
      "I know this might be unpopular, but I believe [opinion]…",
      "Why [popular trend] is actually overrated…",
      "I’m not a fan of [common practice], and here’s why…",
      "This might be controversial, but [statement]…"
    ]
  },
  {
    id: 'relatable',
    name: 'Relatable',
    description: 'Personal connection.',
    examples: [
      "If you’ve ever felt [emotion], this is for you…",
      "I know I’m not the only one who [does habit]…",
      "We’ve all been there—here’s how I handled it…",
      "This is for anyone who’s ever felt [feeling]…"
    ]
  },
  {
    id: 'visual',
    name: 'Visual/Action',
    description: 'Eye-catching start.',
    examples: [
      "Watch what happens when I [action]…",
      "You won’t believe what I’m about to do…",
      "Check this out—this is amazing…",
      "Watch closely—this happens fast…"
    ]
  },
  {
    id: 'mystery',
    name: 'Mystery/Suspense',
    description: 'Build anticipation.',
    examples: [
      "Something incredible is about to happen…",
      "I bet you can’t guess what happens next…",
      "The ending will leave you speechless…",
      "What happens next will blow your mind…"
    ]
  }
];

// Keeping existing viral scripts for structure reference
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
    framework: 'PAS',
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

const COMPETITOR_DB: CompetitorInsight[] = [
  { id: 'c1', category: 'fashion', insight: "Try-on hauls performed 30% better when showing sizing chart on screen.", trendStatus: 'peak' },
  { id: 'c2', category: 'beauty', insight: "Texture close-ups (macro shots) are currently outperforming face-talking videos.", trendStatus: 'emerging' },
  { id: 'c3', category: 'home', insight: "ASMR unboxing sounds are critical for retention in Q4 2024.", trendStatus: 'peak' }
];

// --- RETRIEVAL LOGIC ---

const detectCategory = (query: string): ProductCategory => {
  const q = query.toLowerCase();
  if (q.includes('dress') || q.includes('shirt') || q.includes('wear') || q.includes('fit') || q.includes('pant') || q.includes('jean')) return 'fashion';
  if (q.includes('skin') || q.includes('hair') || q.includes('makeup') || q.includes('balm')) return 'beauty';
  if (q.includes('clean') || q.includes('decor') || q.includes('kitchen') || q.includes('room')) return 'home';
  if (q.includes('dog') || q.includes('cat') || q.includes('pet')) return 'pet';
  if (q.includes('phone') || q.includes('charger') || q.includes('tech')) return 'tech';
  return 'general';
};

export const retrieveContext = (productName: string, description: string) => {
  const query = `${productName} ${description}`;
  const category = detectCategory(query);

  // 1. Retrieve Maddie DNA (Always active)
  const maddieDNA = MADDIE_DNA;

  // 2. Retrieve Hooks (RANDOMIZED FOR VARIETY)
  // Instead of static mapping, we shuffle the categories and pick 3 distinct types
  // This ensures every generation request yields different hook strategies (e.g. Shock vs Story vs Question)
  const shuffledCategories = [...MASTER_HOOKS_DB].sort(() => 0.5 - Math.random());
  const selectedHookCategories = shuffledCategories.slice(0, 3);
  
  // Flatten to specific hook examples for the prompt
  const selectedHooks = selectedHookCategories.map(cat => ({
    type: cat.name,
    examples: cat.examples
  }));

  // 3. Retrieve Viral Scripts (Contextual)
  const viralScripts = VIRAL_SCRIPTS_DB.filter(s => s.category === category || s.category === 'general').slice(0, 2);

  // 4. Retrieve Competitor Insights
  const insights = COMPETITOR_DB.filter(c => c.category === category);

  return {
    category,
    maddieDNA,
    hooks: selectedHooks,
    viralScripts,
    insights
  };
};

export const getMaddiePersonaString = () => {
    return `
    CHARACTERISTICS:
    ${MADDIE_DNA.characteristics.join('\n')}
    
    LANGUAGE PATTERNS (MUST USE):
    ${MADDIE_DNA.languagePatterns.mustUse.join('\n')}
    
    STRUCTURE RULES:
    ${MADDIE_DNA.structureRules.join('\n')}
    `;
};
