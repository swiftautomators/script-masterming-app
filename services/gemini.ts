
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION, RESEARCH_PROMPT_TEMPLATE, DRAFT_PROMPT_TEMPLATE, FINALIZATION_PROMPT_TEMPLATE, VIRAL_REPURPOSE_PROMPT, REFINE_DRAFT_PROMPT_TEMPLATE } from "../constants";
import { ResearchResult, ScriptVariation, FinalScript } from "../types";
import { retrieveContext } from "./knowledgeBase";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to safely parse JSON from AI response, handling Markdown code blocks
 */
const parseAIJSON = <T>(text: string): T => {
  try {
    let cleanText = text.trim();
    // Remove markdown code blocks if present (e.g. ```json ... ```)
    cleanText = cleanText.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    return JSON.parse(cleanText) as T;
  } catch (e) {
    console.error("JSON Parse Error:", e);
    console.error("Raw Text:", text);
    throw new Error("Failed to parse AI response structure.");
  }
};

/**
 * Step 1: Research the product using Gemini Flash + Google Search
 */
export const researchProduct = async (productName: string, productDesc: string, imageBase64: string | null): Promise<ResearchResult> => {
  try {
    const parts: any[] = [];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/png', // Assuming PNG or JPEG
          data: imageBase64
        }
      });
    }

    parts.push({
      text: `${RESEARCH_PROMPT_TEMPLATE(productName)}\n\nProduct Details/Context: ${productDesc}`
    });

    // Use Gemini 2.5 Flash for fast research with Search Grounding
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        tools: [{ googleSearch: {} }], // Enable Google Search Grounding
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Lower temperature for factual research
      }
    });

    const text = response.text || "No research data found. Proceeding with general knowledge.";
    
    // Extract URLs from grounding metadata if available
    const competitorUrls: string[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) competitorUrls.push(chunk.web.uri);
      });
    }

    return {
      summary: text,
      competitorUrls: competitorUrls.slice(0, 3) // Top 3 sources
    };

  } catch (error) {
    console.error("Research Error:", error);
    throw new Error("Failed to research product.");
  }
};

/**
 * Step 2: Generate Draft Scripts using Gemini 3 Pro (Thinking Mode)
 * WITH RAG KNOWLEDGE BASE INTEGRATION
 */
export const generateDrafts = async (productName: string, length: string, researchSummary: string, isFaceless: boolean): Promise<ScriptVariation[]> => {
  try {
    // RAG STEP: Retrieve relevant context from knowledge base
    const context = retrieveContext(productName, researchSummary);
    
    // Format context for the prompt
    const ragContextString = `
    DETECTED CATEGORY: ${context.category.toUpperCase()}
    
    VOICE PATTERNS TO USE:
    ${context.voicePatterns.map(v => `- "${v.pattern}" (${v.usageContext})`).join('\n')}
    
    PROVEN HOOKS TO ADAPT:
    ${context.hooks.map(h => `- "${h.text}" (Type: ${h.type})`).join('\n')}
    
    COMPETITOR INSIGHTS:
    ${context.insights.map(i => `- ${i.insight}`).join('\n')}
    
    SIMILAR VIRAL SCRIPTS (FOR STRUCTURE REFERENCE):
    ${context.viralScripts.map(s => `- [${s.productName}]: ${s.scriptText.substring(0, 100)}...`).join('\n')}
    `;

    // Use Gemini 3 Pro for creative writing and "Thinking"
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: DRAFT_PROMPT_TEMPLATE(productName, length, researchSummary, isFaceless, ragContextString),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 32768 }, // Deep thinking for creative structure
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    framework: { type: Type.STRING },
                    hookStrategy: { type: Type.STRING },
                    content: { type: Type.STRING }
                },
                required: ["id", "title", "framework", "hookStrategy", "content"]
            }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from drafting model");
    
    // Parse and Validate
    const parsed = parseAIJSON<any>(jsonText);
    
    let scripts: ScriptVariation[] = [];
    
    if (Array.isArray(parsed)) {
      scripts = parsed;
    } else if (typeof parsed === 'object' && parsed !== null) {
      // Sometimes models wrap arrays in an object key like "scripts": [...]
      const possibleArray = Object.values(parsed).find(val => Array.isArray(val));
      if (possibleArray) {
        scripts = possibleArray as ScriptVariation[];
      }
    }

    if (!scripts || scripts.length === 0) {
      throw new Error("Invalid draft structure: No scripts found.");
    }
    
    return scripts;

  } catch (error) {
    console.error("Drafting Error:", error);
    throw new Error("Failed to generate drafts.");
  }
};

/**
 * Analyze a Viral Script and generate iterations
 */
export const repurposeViralScript = async (originalScript: string): Promise<{ analysis: string, scripts: ScriptVariation[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: VIRAL_REPURPOSE_PROMPT(originalScript),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                analysis: { type: Type.STRING },
                scripts: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.INTEGER },
                            title: { type: Type.STRING },
                            framework: { type: Type.STRING },
                            hookStrategy: { type: Type.STRING },
                            content: { type: Type.STRING }
                        },
                        required: ["id", "title", "framework", "hookStrategy", "content"]
                    }
                }
            },
            required: ["analysis", "scripts"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from viral analysis");

    return parseAIJSON<{ analysis: string, scripts: ScriptVariation[] }>(jsonText);

  } catch (error) {
    console.error("Viral Analysis Error:", error);
    throw new Error("Failed to analyze viral script.");
  }
};

/**
 * Step 3: Finalize the script using Gemini 3 Pro
 */
export const finalizeScriptData = async (selectedScript: ScriptVariation, productName: string, isFaceless: boolean): Promise<FinalScript> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: FINALIZATION_PROMPT_TEMPLATE(selectedScript.content, productName, isFaceless),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json", // Ensure structured output
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                verbalHook: { type: Type.STRING },
                visualHook: { type: Type.STRING },
                onScreenHook: { type: Type.STRING },
                fullScript: { type: Type.STRING },
                additionalText: { type: Type.STRING },
                caption: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                notes: { type: Type.STRING },
            },
            required: ["verbalHook", "visualHook", "onScreenHook", "fullScript", "additionalText", "caption", "hashtags", "notes"],
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from finalization");

    const parsed = parseAIJSON<FinalScript>(jsonText);
    // Attach original metadata for display purposes
    return {
        ...parsed,
        id: selectedScript.id,
        framework: selectedScript.framework
    };

  } catch (error) {
    console.error("Finalization Error:", error);
    throw new Error("Failed to finalize script.");
  }
};

/**
 * Refine an existing draft based on user instructions
 */
export const refineDraft = async (originalScript: string, instructions: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: REFINE_DRAFT_PROMPT_TEMPLATE(originalScript, instructions),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from refinement");

    return text.trim();

  } catch (error) {
    console.error("Refinement Error:", error);
    throw new Error("Failed to refine script.");
  }
};

/**
 * Transcribe audio/video file using Gemini Flash 2.5
 */
export const transcribeMedia = async (base64Data: string, mimeType: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType, data: base64Data } },
                    { text: "Transcribe the spoken audio in this file word-for-word. Ignore background noise. Return ONLY the transcript text." }
                ]
            }
        });
        return response.text || "";
    } catch (error) {
        console.error("Transcription Error:", error);
        throw new Error("Failed to transcribe media.");
    }
};

/**
 * Transcribe/Summarize URL using Gemini Search Grounding
 */
export const transcribeUrl = async (url: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Find the transcript or a detailed description of the video content at this URL: ${url}. Return the spoken script or a very close approximation.`,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });
        return response.text || "";
    } catch (error) {
        console.error("URL Transcription Error:", error);
        throw new Error("Failed to analyze URL.");
    }
};
