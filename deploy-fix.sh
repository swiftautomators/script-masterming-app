#!/bin/bash

# Script to commit and push fixes to GitHub

echo "🔧 Preparing to push fixes to GitHub..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the project directory!"
    echo "Please cd into: /Users/brassfieldventuresllc/Downloads/tiktok-shop-script-mastermind\ (2)"
    exit 1
fi

# Show what changed
echo "📝 Files that will be updated:"
echo "  - package.json (React 18 + official Google SDK)"
echo "  - services/gemini.ts (Complete SDK rewrite)"
echo ""

# Stage the changes
git add package.json services/gemini.ts

# Commit
git commit -m "fix: Switch to official Google Generative AI SDK and React 18

- Replace @google/genai with @google/generative-ai
- Downgrade React to 18.3.1 for compatibility
- Rewrite all API calls to use new SDK syntax
- Disable Google Search to avoid rate limits
- Increase retry delays for quota errors"

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Done! Vercel will auto-deploy in ~2 minutes."
echo "📱 Check your deployment at: https://vercel.com/swift-automators-projects/script-masterming-app"
echo ""
echo "⏰ After deployment completes:"
echo "   1. Clear your browser storage (localStorage.clear() in console)"
echo "   2. Get a FRESH API key from: https://aistudio.google.com/apikey"
echo "   3. Wait 5 minutes after creating the key"
echo "   4. Enter it in your app and test!"
