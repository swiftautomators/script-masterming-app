
import { LibraryResource, SavedScript } from "../types";

export const MOCK_SAVED_SCRIPTS: SavedScript[] = [
  {
    id: '1',
    title: 'Viral Bodysuit Reveal',
    productName: 'Sculpting Bodysuit',
    category: 'Fashion',
    framework: 'Problem-Solution',
    thumbnail: null,
    dateCreated: '2023-11-15',
    metrics: { views: '1.2M', ctr: '4.5%', sales: '850' },
    content: "Stop scrolling if you hate wearing bras..."
  },
  {
    id: '2',
    title: 'ASMR Keyboard Cleaning',
    productName: 'Gel Cleaner Slime',
    category: 'Tech',
    framework: 'ASMR / Sensory',
    thumbnail: null,
    dateCreated: '2023-12-02',
    metrics: { views: '500K', ctr: '3.2%', sales: '200' },
    content: "[Sound of sticky gel squishing]..."
  }
];

export const LEARNING_RESOURCES: LibraryResource[] = [
  {
    id: 'l1',
    title: 'The "Wait for it" Visual Hook',
    category: 'Hooks',
    content: "Start with a blurry visual that comes into focus exactly at 2.5s. Increases retention by 40%.",
    tags: ['Visuals', 'Retention'],
    author: 'Industry'
  },
  {
    id: 'l2',
    title: 'Maddie\'s "Bestie" Intro',
    category: 'Voice',
    content: "Use phrases like 'Okay, we need to talk about this' or 'I am literally shaking'. Creates immediate parasocial bond.",
    tags: ['Voice', 'Personality'],
    author: 'Maddie'
  },
  {
    id: 'l3',
    title: 'The 3-Angle Rule for Faceless',
    category: 'Filming',
    content: "Never stay on one static shot for more than 3 seconds. Rotate: Wide -> Macro Texture -> Use Case.",
    tags: ['Faceless', 'Editing'],
    author: 'Industry'
  }
];

export const ANALYTICS_DATA = {
  bestFrameworks: [
    { name: 'Problem-Agitate-Solution', score: 92 },
    { name: 'ASMR Unboxing', score: 88 },
    { name: 'Before & After', score: 75 },
  ],
  topHooks: [
    { text: "I wish I knew this sooner...", conversion: '5.2%' },
    { text: "Don't buy [Competitor] until you see this", conversion: '4.8%' },
    { text: "POV: You found the perfect [Product]", conversion: '4.1%' },
  ],
  voiceConsistency: 85 // Percentage
};
