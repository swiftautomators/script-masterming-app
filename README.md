<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1CwaPAIE8IaHK5imcinnA1G1D6iQH9XLk

## 🤖 Multi-Agent Architecture

This app uses a **multi-agent n8n system** to generate category-specific TikTok scripts:

### Agent Pipeline
1. **🎬 Orchestrator** - Detects product category (fashion/beauty/home/pet/tech/fitness)
2. **🔍 Research Agent** - Generates market intelligence summaries
3. **🎣 Hook Specialist** - Creates 5 psychology-based hooks per category
4. **✍️ Script Writer** - Generates 3 complete script variations
5. **💎 Polish Agent** - Adds hashtags, captions, and production notes

### Voice Profiles by Category
- **Fashion**: "True to size ladies", "The hem is perfect", fit-focused language
- **Beauty**: "Glass skin energy", "Wait until you see this texture", texture-focused
- **Home**: "Renter friendly", "It's giving luxury", aesthetic language
- **Pet**: "Watch their reaction", "Vet approved", safety-focused
- **Tech**: "Life before vs after", "30 second setup", jargon-free
- **Fitness**: "Game changer for recovery", "Results in 2 weeks", motivation-focused

### n8n Setup Required
You must have 5 active n8n workflows:
- 🎬 TikTok Script Orchestrator (ID: `NDW6GorHdHgI9M4H`)
- 🔍 Research Agent (ID: `nfY3cimq8fpQYpwy`)
- 🎣 Hook Specialist (ID: `d6vojeemM9NhRxNi`)
- ✍️ Script Writer (ID: `biv1jkE3FO8NvYvY`)
- 💎 Polish Agent (ID: `GbpsVbmFP0QurDAN`)

**Environment Setup:**
```bash
cp .env.example .env.local
# Edit .env.local and set:
VITE_N8N_WEBHOOK_BASE_URL=https://your-n8n-instance.com
```

For detailed workflow setup, see the [n8n documentation](https://docs.n8n.io/).

---

## 🔥 Viral Tools

New powerful features for deep market analysis and content adaptation:

### 1. Viral Re-Purpose (`src/services/viralTools.ts`)
- **Analyzes** high-performing videos to extract viral DNA
- **Identifies** hooks, pacing, and psychological triggers
- **Generates** 3 unique script variations adapted for your product

### 2. Competitor Spy (`src/services/viralTools.ts`)
- **Extracts** winning strategies from competitor profiles
- **Identifies** top posting times and hashtag clusters
- **Reveals** their most effective hook patterns

See [docs/VIRAL-TOOLS.md](docs/VIRAL-TOOLS.md) for full documentation.

---

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
