# 🔥 VIRAL TOOLS DOCUMENTATION

## Overview

Two powerful new features for TikTok script optimization:
1. **🔥 Viral Re-Purpose** - Analyze viral videos and adapt their patterns
2. **🕵️ Competitor Spy** - Extract competitor strategies and insights

---

## 🔥 VIRAL RE-PURPOSE TOOL

### Purpose
Analyzes successful TikTok videos to extract viral patterns and generate script variations adapted for your products.

### Workflow ID
`5EdDU2XtA73jURF1`

### Webhook Endpoint
`https://your-n8n-instance.com/webhook/viral-repurpose`

---

### Input Options

#### Option 1: TikTok URL
```typescript
{
  videoUrl: "https://tiktok.com/@user/video/123456789",
  targetProduct: "Your Product Name" // Optional
}
```

#### Option 2: Upload Video File
```typescript
{
  videoFile: "base64_encoded_video_data",
  videoData: fileObject,
  targetProduct: "Your Product Name" // Optional
}
```

---

### Response Structure

```typescript
{
  success: true,
  originalTranscript: "0-3s: Hook\n4-15s: Body...",
  viralScore: 8.5,
  
  analysis: {
    hook: {
      type: "Size Reveal",
      pattern: "If you're [demographic], watch this",
      effectiveness: "Creates immediate relevance"
    },
    structure: {
      framework: "PAS",
      pacing: "Fast opening, detailed middle, urgency close",
      timing: "0-3s hook, 4-15s problem/solution, 16-25s proof, 26-30s CTA"
    },
    language: {
      tone: "Conversational, authentic",
      keywords: ["true to size", "unreal", "zero"],
      emphasis: "Fit details, transparency"
    },
    viralElements: [
      "Specific size mention (relatability)",
      "Problem acknowledgment",
      "Visual proof promise",
      "Scarcity trigger"
    ]
  },
  
  variations: [
    {
      id: 1,
      title: "Direct Pattern Match",
      description: "Uses exact same structure",
      hook: "If you're a size 10-12, watch this",
      script: "Full adapted script...",
      adaptationNotes: "Replace size with your differentiator"
    },
    {
      id: 2,
      title: "Hook Variation",
      description: "Different hook, same body",
      hook: "You NEED to see this",
      script: "Full script...",
      adaptationNotes: "Stronger FOMO hook"
    },
    {
      id: 3,
      title: "Category Adaptation",
      description: "Adapted for different product type",
      hook: "If you're a size 10-12, watch this",
      script: "Full script...",
      adaptationNotes: "Cross-category adaptation"
    }
  ]
}
```

---

### Use Cases

**1. Learning from Viral Content**
```typescript
// User pastes viral TikTok URL
const result = await analyzeViralVideo({
  videoUrl: "https://tiktok.com/@fashionista/video/123"
});

// Shows what made it viral
console.log(result.viralElements);
// ["Specific size mention", "Problem acknowledgment", ...]
```

**2. Adapting for Your Product**
```typescript
// Analyze viral video + adapt for user's product
const result = await analyzeViralVideo({
  videoUrl: "https://tiktok.com/@competitor/video/456",
  targetProduct: "LED Strip Lights"
});

// Get 3 ready-to-use variations
result.variations.forEach(variation => {
  console.log(variation.title);
  console.log(variation.script);
});
```

**3. Upload Your Own Video**
```typescript
// User uploads MP4 from their phone
const base64Video = await fileToBase64(uploadedFile);
const result = await analyzeViralVideo({
  videoFile: base64Video,
  videoData: uploadedFile
});
```

---

## 🕵️ COMPETITOR SPY TOOL

### Purpose
Analyzes competitor TikTok profiles to extract their winning strategies, hooks, and content patterns.

### Workflow ID
`70lbieqn8Tnh5CQy`

### Webhook Endpoint
`https://your-n8n-instance.com/webhook/competitor-spy`

---

### Input Options

#### Option 1: TikTok Handle
```typescript
{
  tiktokHandle: "@competitor" // or "competitor" without @
}
```

#### Option 2: Single Video URL
```typescript
{
  videoUrl: "https://tiktok.com/@competitor/video/123456789"
}
```

---

### Response Structure

```typescript
{
  success: true,
  analyzedAt: "2024-12-12T16:30:00Z",
  
  insights: {
    summary: {
      handle: "competitor",
      followers: 125000,
      avgEngagement: 7.11,
      analyzedVideos: 3
    },
    
    topStrategies: [
      {
        strategy: "Size-Specific Targeting",
        frequency: 2,
        example: "If you're a size 10-12...",
        recommendation: "Use specific demographics for higher relatability"
      },
      {
        strategy: "Scarcity Triggers",
        frequency: 1,
        example: "Selling out fast",
        recommendation: "Create urgency with limited availability"
      },
      {
        strategy: "Problem-Solution Framework",
        frequency: 1,
        example: "Finally found pants that don't gap",
        recommendation: "Lead with problems, deliver solutions"
      }
    ],
    
    contentCalendar: {
      bestPostingTimes: ["2-4 PM EST", "7-9 PM EST"],
      recommendedFrequency: "3-5 posts per week",
      optimalLength: "15-30 seconds"
    },
    
    hashtagStrategy: {
      topPerformingHashtags: [
        { tag: "fashion", uses: 3 },
        { tag: "ootd", uses: 2 },
        { tag: "tiktokfinds", uses: 2 }
      ],
      recommendation: "Mix 2-3 niche tags with 2-3 trending tags"
    },
    
    bestPerformingVideo: {
      url: "https://tiktok.com/@competitor/video/3",
      views: 203000,
      likes: 18900,
      caption: "Finally found pants that don't gap #fashion",
      hook: "Finally found pants that don't gap"
    },
    
    actionableHooks: [
      "If you're a size 10-12 watch this",
      "These are about to sell out again",
      "Finally found pants that don't gap"
    ],
    
    recommendations: [
      "Use their size-specific hook pattern",
      "Incorporate scarcity language in CTA",
      "Match their conversational tone",
      "Test their top hashtag combinations",
      "Post during peak engagement windows"
    ]
  }
}
```

---

### Use Cases

**1. Profile Deep Dive**
```typescript
// Analyze competitor's entire profile
const result = await analyzeCompetitor({
  tiktokHandle: "@fashioncompetitor"
});

// Extract their winning hooks
console.log(result.insights.actionableHooks);
// ["If you're a size 10-12...", "Selling out fast", ...]

// Get their hashtag strategy
console.log(result.insights.hashtagStrategy.topPerformingHashtags);
```

**2. Single Video Analysis**
```typescript
// Deep dive into one viral video
const result = await analyzeCompetitor({
  videoUrl: "https://tiktok.com/@competitor/video/123"
});

// See what made this specific video successful
console.log(result.insights.bestPerformingVideo);
```

**3. Build Content Calendar**
```typescript
const result = await analyzeCompetitor({
  tiktokHandle: "@topperformer"
});

// Get posting schedule insights
const calendar = result.insights.contentCalendar;
console.log(calendar.bestPostingTimes);    // ["2-4 PM EST", "7-9 PM EST"]
console.log(calendar.recommendedFrequency); // "3-5 posts per week"
```

---

## ⚡ WORKFLOW ACTIVATION

Both workflows need to be activated in n8n:

1. Go to your n8n instance
2. Find workflows:
   - 🔥 Viral Re-Purpose Tool (`5EdDU2XtA73jURF1`)
   - 🕵️ Competitor Spy Tool (`70lbieqn8Tnh5CQy`)
3. Click toggle switch to activate (turn green)

---

## 🧪 TESTING

### Test Viral Re-Purpose
```bash
curl -X POST https://your-n8n.com/webhook/viral-repurpose \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://tiktok.com/@user/video/123",
    "targetProduct": "Test Product"
  }'
```

**Expected**: Returns analysis + 3 script variations

### Test Competitor Spy
```bash
curl -X POST https://your-n8n.com/webhook/competitor-spy \
  -H "Content-Type: application/json" \
  -d '{
    "tiktokHandle": "competitor"
  }'
```

**Expected**: Returns insights with strategies, hooks, and recommendations

---

## 🔮 FUTURE ENHANCEMENTS

### Phase 2 (Add Real Scraping)

**For Viral Re-Purpose:**
- Use **Firecrawl** or **Browserless** to download actual TikTok videos
- Use **FFmpeg** (via n8n) to extract audio
- Use **Gemini API** with audio input for real transcription
- Store transcripts in database for pattern learning

**For Competitor Spy:**
- Use **Firecrawl** to scrape TikTok profiles
- Use **SerpAPI** for TikTok search results
- Extract real engagement metrics
- Build hook pattern database over time

### Phase 3 (Advanced Features)

**Viral Re-Purpose:**
- Auto-detect product category from viral video
- Generate category-adapted variations
- Suggest A/B testing scripts
- Track which adaptations perform best

**Competitor Spy:**
- Track competitor changes over time
- Alert when competitor posts
- Compare multiple competitors
- Generate competitive advantage reports

---

## 📊 CURRENT LIMITATIONS

**Simulated Data:**
- Both workflows currently use **template data**
- Video downloads are simulated
- Transcriptions are sample data
- Competitor profiles are mock data

**Why Templates First?**
- Fast responses (2-3 seconds)
- No API rate limits
- Reliable for testing
- Easy to upgrade later

**Production Upgrade:**
- Replace Code nodes with real API calls
- Add Firecrawl for scraping
- Add Gemini for transcription
- Add database for insights storage

---

## 🎯 BEST PRACTICES

### Viral Re-Purpose
1. **Choose high-performing videos** (100K+ views)
2. **Analyze multiple videos** from same niche
3. **Look for pattern consistency** across variations
4. **Test adaptations** with A/B testing
5. **Track which patterns work** for your audience

### Competitor Spy
1. **Analyze successful competitors** (not just anyone)
2. **Focus on recent content** (last 30 days)
3. **Look for consistent patterns** (not one-off virality)
4. **Adapt, don't copy** - make it your own
5. **Monitor regularly** - strategies change

---

## ✅ SUCCESS METRICS

### Viral Re-Purpose Working When:
- ✅ Extracts hooks from viral videos
- ✅ Identifies viral elements (patterns)
- ✅ Generates 3 unique variations
- ✅ Provides adaptation notes
- ✅ Maintains original viral structure

### Competitor Spy Working When:
- ✅ Extracts competitor strategies
- ✅ Identifies top-performing hooks
- ✅ Provides actionable recommendations
- ✅ Shows hashtag patterns
- ✅ Suggests posting schedule

---

## 🎉 READY TO USE!

1. **Activate both workflows** in n8n
2. **Add viralTools.ts** to your React app
3. **Create UI components** (see examples above)
4. **Test with real TikTok URLs**
5. **Start analyzing and adapting!**

Your wife can now:
- 🔥 Learn from viral videos
- 🕵️ Spy on competitors
- 📝 Generate adapted scripts
- 🎯 Build winning content strategies

**No more guessing what works - now you have the data!** 🎊
