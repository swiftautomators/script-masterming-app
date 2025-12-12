/**
 * @deprecated This file is deprecated as of December 2024
 * The app now uses n8n multi-agent workflows for script generation.
 * See src/services/n8nAgents.ts for the new implementation.
 * 
 * This file is kept for reference only and may be removed in future versions.
 * 
 * Reason for deprecation:
 * - Single Gemini prompt couldn't handle category-specific voices
 * - Fashion language was being applied to ALL product categories
 * - Multi-agent architecture provides better category separation
 */

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION, RESEARCH_PROMPT_TEMPLATE, DRAFT_PROMPT_TEMPLATE, FINALIZATION_PROMPT_TEMPLATE, VIRAL_REPURPOSE_PROMPT, REFINE_DRAFT_PROMPT_TEMPLATE, COMPETITOR_ANALYSIS_PROMPT } from "../constants";
import { ResearchResult, ScriptVariation, FinalScript, CompetitorAnalysis } from "../types";
import { retrieveContext, getMaddiePersonaString } from "./knowledgeBase";

// Lazy initialization helper to prevent top-level crashes during build/startup
const getAI = () => {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('user_gemini_api_key') : null;

  if (!apiKey) {
    throw new Error("API Key is missing. Please log out and enter your API Key.");
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Helper to safely parse JSON from AI response, handling Markdown code blocks and conversational filler
 */
const parseAIJSON = <T>(text: string): T => {
  try {
    let cleanText = text.trim();

    // Aggressively search for JSON code block
    const jsonBlockMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      cleanText = jsonBlockMatch[1];
    } else {
      // Fallback: try to remove simple markdown tokens if regex didn't catch a full block
      cleanText = cleanText.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }

    return JSON.parse(cleanText) as T;
  } catch (e) {
    console.error("JSON Parse Error:", e);
    console.error("Raw Text:", text);
    throw new Error("Failed to parse AI response structure.");
  }
};

/**
 * Retry Operation Wrapper with Exponential Backoff
 * Handles 429 (Too Many Requests) and 503 (Service Unavailable) automatically.
 */
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries = 3,
  initialDelay = 3000
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      const errStr = error?.toString()?.toLowerCase() || "";
      const msg = error?.message?.toLowerCase() || "";

      // Identify retryable errors
      const isQuota = msg.includes('resource_exhausted') || errStr.includes('429') || msg.includes('quota');
      const isRetryable =
        isQuota ||
        errStr.includes('503') ||
        errStr.includes('500') ||
        msg.includes('overloaded') ||
        msg.includes('model is overloaded') ||
        msg.includes('internal server error') ||
        msg.includes('service unavailable');

      if (isRetryable && i < retries - 1) {
        let delay = (initialDelay * Math.pow(1.5, i)) + (Math.random() * 1000);

        if (isQuota) {
          console.warn(`Quota hit (Attempt ${i + 1}). Waiting 60 seconds...`);
          delay = Math.max(delay, 60000);
        } else {
          console.warn(`API Busy (Attempt ${i + 1}). Retrying in ${Math.round(delay)}ms...`);
        }

        await wait(delay);
        continue;
      }

      break;
    }
  }

  throw lastError;
};

/**
 * Step 1: Research the product using Gemini Flash (Search disabled for rate limit safety)
 */
export const researchProduct = async (productName: string, productDesc: string, imageBase64: string | null): Promise<ResearchResult> => {
  const ai = getAI();
  const parts: any[] = [];

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: imageBase64
      }
    });
  }

  parts.push({
    text: `${RESEARCH_PROMPT_TEMPLATE(productName)}\n\nProduct Details/Context: ${productDesc}`
  });

  // Skip Google Search to avoid rate limits - use knowledge-based research
  console.log("Using knowledge-based research (Google Search disabled to avoid rate limits)");

  return await retryOperation(async () => {
    try {
      const model = ai.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.4,
        }
      });

      const response = await result.response;
      return {
        summary: response.text() || "Analysis complete.",
        competitorUrls: []
      };
    } catch (fallbackError) {
      throw new Error("Failed to research product: " + (fallbackError as any)?.message);
    }
  }, 3, 5000);
};

/**
 * Step 2: Generate Draft Scripts using Gemini 2.0 Flash
 */
export const generateDrafts = async (productName: string, length: string, researchSummary: string, isFaceless: boolean): Promise<ScriptVariation[]> => {
  const ai = getAI();

  // RAG STEP: Retrieve relevant context from knowledge base
  const context = retrieveContext(productName, researchSummary);

  const ragContextString = `
  DETECTED CATEGORY: ${context.category.toUpperCase()}
  
  === MADDIE'S DNA (MANDATORY VOICE) ===
  CHARACTERISTICS:
  ${context.maddieDNA.characteristics.map(c => `- ${c}`).join('\n')}
  
  LANGUAGE PATTERNS (USE THESE):
  ${context.maddieDNA.languagePatterns.mustUse.map(p => `- "${p}"`).join('\n')}
  
  SCRIPT STRUCTURE RULES:
  ${context.maddieDNA.structureRules.map(r => `- ${r}`).join('\n')}

  === SELECTED HOOK STRATEGIES FOR THIS SESSION (USE ONE PER VARIATION) ===
  ${context.hooks.map((h, i) => `
  HOOK TYPE ${i + 1}: ${h.type}
  Examples:
  ${h.examples.map(ex => `  - "${ex}"`).join('\n')}
  `).join('\n')}
  
  COMPETITOR INSIGHTS:
  ${context.insights.map(i => `- ${i.insight}`).join('\n')}
  
  REFERENCE SCRIPTS:
  ${context.viralScripts.map(s => `- [${s.productName}]: ${s.scriptText.substring(0, 100)}...`).join('\n')}
  `;

  const prompt = DRAFT_PROMPT_TEMPLATE(productName, length, researchSummary, isFaceless, ragContextString);

  const schema = {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.NUMBER },
        title: { type: SchemaType.STRING },
        framework: { type: SchemaType.STRING },
        hookStrategy: { type: SchemaType.STRING },
        content: { type: SchemaType.STRING }
      },
      required: ["id", "title", "framework", "hookStrategy", "content"]
    }
  };

  return await retryOperation(async () => {
    try {
      const model = ai.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });

      const response = await result.response;
      if (!response.text()) throw new Error("Empty response from AI");
      return parseAndValidateScripts(response.text());
    } catch (error) {
      console.error("Draft generation failed", error);
      throw new Error("Failed to generate drafts.");
    }
  }, 3, 4000);
};

// Helper to handle script array parsing
function parseAndValidateScripts(jsonText: string): ScriptVariation[] {
  const parsed = parseAIJSON<any>(jsonText);
  let scripts: ScriptVariation[] = [];

  if (Array.isArray(parsed)) {
    scripts = parsed;
  } else if (typeof parsed === 'object' && parsed !== null) {
    const possibleArray = Object.values(parsed).find(val => Array.isArray(val));
    if (possibleArray) {
      scripts = possibleArray as ScriptVariation[];
    }
  }

  if (!scripts || scripts.length === 0) {
    throw new Error("Invalid draft structure: No scripts found.");
  }
  return scripts;
}

/**
 * Analyze a Viral Script and generate iterations
 */
export const repurposeViralScript = async (originalScript: string): Promise<{ analysis: string, scripts: ScriptVariation[] }> => {
  const ai = getAI();
  const prompt = VIRAL_REPURPOSE_PROMPT(originalScript);

  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      analysis: { type: SchemaType.STRING },
      scripts: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.NUMBER },
            title: { type: SchemaType.STRING },
            framework: { type: SchemaType.STRING },
            hookStrategy: { type: SchemaType.STRING },
            content: { type: SchemaType.STRING }
          },
          required: ["id", "title", "framework", "hookStrategy", "content"]
        }
      }
    },
    required: ["analysis", "scripts"]
  };

  return await retryOperation(async () => {
    try {
      const model = ai.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });

      const response = await result.response;
      if (!response.text()) throw new Error("Empty response");
      return parseAIJSON(response.text());

    } catch (error) {
      console.error("Viral Analysis Failed", error);
      throw new Error("Failed to analyze viral script.");
    }
  }, 3, 3000);
};

/**
 * Step 3: Finalize the script
 */
export const finalizeScriptData = async (selectedScript: ScriptVariation, productName: string, isFaceless: boolean): Promise<FinalScript> => {
  const ai = getAI();
  const prompt = FINALIZATION_PROMPT_TEMPLATE(selectedScript.content, productName, isFaceless);

  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      verbalHook: { type: SchemaType.STRING },
      visualHook: { type: SchemaType.STRING },
      onScreenHook: { type: SchemaType.STRING },
      fullScript: { type: SchemaType.STRING },
      additionalText: { type: SchemaType.STRING },
      caption: { type: SchemaType.STRING },
      hashtags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      notes: { type: SchemaType.STRING },
    },
    required: ["verbalHook", "visualHook", "onScreenHook", "fullScript", "additionalText", "caption", "hashtags", "notes"],
  };

  return await retryOperation(async () => {
    try {
      const model = ai.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });

      const response = await result.response;
      if (!response.text()) throw new Error("Empty response");
      const parsed = parseAIJSON<FinalScript>(response.text());
      return { ...parsed, id: selectedScript.id, framework: selectedScript.framework };

    } catch (error) {
      console.error("Finalization failed", error);
      throw new Error("Failed to finalize script.");
    }
  }, 3, 3000);
};

/**
 * Refine an existing draft based on user instructions
 */
export const refineDraft = async (originalScript: string, instructions: string): Promise<string> => {
  return await retryOperation(async () => {
    try {
      const ai = getAI();
      const model = ai.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const prompt = REFINE_DRAFT_PROMPT_TEMPLATE(originalScript, instructions);
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      const response = await result.response;
      const text = response.text();
      if (!text) throw new Error("Empty response from refinement");

      return text.trim();

    } catch (error) {
      console.error("Refinement Error:", error);
      throw new Error("Failed to refine script.");
    }
  });
};

/**
 * Transcribe audio/video file using Gemini Flash
 */
export const transcribeMedia = async (base64Data: string, mimeType: string): Promise<string> => {
  return await retryOperation(async () => {
    try {
      const ai = getAI();
      const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: "Transcribe the spoken audio in this file word-for-word. Ignore background noise. Return ONLY the transcript text." }
          ]
        }]
      });

      const response = await result.response;
      return response.text() || "";
    } catch (error) {
      console.error("Transcription Error:", error);
      throw new Error("Failed to transcribe media.");
    }
  });
};

/**
 * Transcribe/Summarize URL - Disabled to avoid Search rate limits
 */
export const transcribeUrl = async (url: string): Promise<string> => {
  return "URL transcription disabled to avoid rate limits. Please paste the script manually.";
};

/**
 * Analyze Competitor - Search disabled to avoid rate limits
 */
export const analyzeCompetitor = async (handleOrUrl: string): Promise<CompetitorAnalysis> => {
  const ai = getAI();
  const maddieContext = getMaddiePersonaString();
  const prompt = COMPETITOR_ANALYSIS_PROMPT(handleOrUrl, maddieContext) + "\n\n(Note: Generate analysis based on typical patterns for this niche since live search is unavailable to avoid rate limits)";

  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      competitorName: { type: SchemaType.STRING },
      performanceOverview: { type: SchemaType.STRING },
      successfulPatterns: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            patternName: { type: SchemaType.STRING },
            example: { type: SchemaType.STRING },
            whyItWorks: { type: SchemaType.STRING }
          },
          required: ["patternName", "example", "whyItWorks"]
        }
      },
      opportunities: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING }
      },
      differentiationStrategy: { type: SchemaType.STRING },
      sampleScript: { type: SchemaType.STRING }
    },
    required: ["competitorName", "performanceOverview", "successfulPatterns", "opportunities", "differentiationStrategy", "sampleScript"]
  };

  return await retryOperation(async () => {
    try {
      const model = ai.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });

      const response = await result.response;
      if (!response.text()) throw new Error("Empty response");
      return parseAIJSON<CompetitorAnalysis>(response.text());
    } catch (fbError) {
      throw new Error("Failed to analyze competitor.");
    }
  }, 3, 5000);
};
