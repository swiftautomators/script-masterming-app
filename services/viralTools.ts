// src/services/viralTools.ts
// Integration for Viral Re-Purpose and Competitor Spy features

const N8N_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_BASE_URL || 'http://localhost:5678';

// ============================================================================
// WORKFLOW IDS
// ============================================================================
// 🔥 Viral Re-Purpose: 5EdDU2XtA73jURF1
// 🕵️ Competitor Spy: 70lbieqn8Tnh5CQy

// ============================================================================
// VIRAL RE-PURPOSE TOOL
// ============================================================================

export interface ViralRepurposeInput {
    videoUrl?: string;        // TikTok video URL
    videoFile?: string;       // Base64 encoded video file
    videoData?: any;          // File data if uploaded
    targetProduct?: string;   // User's product to adapt script for
}

export interface ScriptVariation {
    id: number;
    title: string;
    description: string;
    hook: string;
    script: string;
    adaptationNotes: string;
}

export interface ViralAnalysis {
    hook: {
        type: string;
        pattern: string;
        effectiveness: string;
    };
    structure: {
        framework: string;
        pacing: string;
        timing: string;
    };
    language: {
        tone: string;
        keywords: string[];
        emphasis: string;
    };
    viralElements: string[];
}

export interface ViralRepurposeResponse {
    success: boolean;
    originalTranscript: string;
    analysis: ViralAnalysis;
    variations: ScriptVariation[];
    viralElements: string[];
    viralScore?: number;
    error?: string;
}

/**
 * Analyzes a viral TikTok video and generates script variations
 */
export async function analyzeViralVideo(
    input: ViralRepurposeInput
): Promise<ViralRepurposeResponse> {
    console.log('🔥 Calling Viral Re-Purpose Tool...', input);

    try {
        const response = await fetch(`${N8N_BASE_URL}/webhook/viral-repurpose`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            throw new Error(`Viral Re-Purpose failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Viral Re-Purpose response:', data);

        return {
            success: true,
            originalTranscript: data.originalTranscript || '',
            analysis: data.analysis || {},
            variations: data.variations || [],
            viralElements: data.viralElements || [],
            viralScore: data.viralScore,
        };

    } catch (error) {
        console.error('❌ Viral Re-Purpose error:', error);

        return {
            success: false,
            originalTranscript: '',
            analysis: {} as ViralAnalysis,
            variations: [],
            viralElements: [],
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ============================================================================
// COMPETITOR SPY TOOL
// ============================================================================

export interface CompetitorSpyInput {
    tiktokHandle?: string;    // @username or username
    videoUrl?: string;        // Single video URL to analyze
}

export interface HookPattern {
    strategy: string;
    frequency: number;
    example: string;
    recommendation: string;
}

export interface HashtagPerformance {
    tag: string;
    uses: number;
}

export interface CompetitorInsights {
    summary: {
        handle: string;
        followers: number | string;
        avgEngagement: number;
        analyzedVideos: number;
    };
    topStrategies: HookPattern[];
    contentCalendar: {
        bestPostingTimes: string[];
        recommendedFrequency: string;
        optimalLength: string;
    };
    hashtagStrategy: {
        topPerformingHashtags: HashtagPerformance[];
        recommendation: string;
    };
    bestPerformingVideo: {
        url: string;
        views: number;
        likes: number;
        caption: string;
        hook: string;
    };
    actionableHooks: string[];
    recommendations: string[];
}

export interface CompetitorSpyResponse {
    success: boolean;
    insights: CompetitorInsights;
    analyzedAt: string;
    error?: string;
}

/**
 * Analyzes a competitor's TikTok profile or specific video
 */
export async function analyzeCompetitor(
    input: CompetitorSpyInput
): Promise<CompetitorSpyResponse> {
    console.log('🕵️ Calling Competitor Spy Tool...', input);

    try {
        const response = await fetch(`${N8N_BASE_URL}/webhook/competitor-spy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            throw new Error(`Competitor Spy failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Competitor Spy response:', data);

        return {
            success: data.success !== false,
            insights: data.insights || {},
            analyzedAt: data.analyzedAt || new Date().toISOString(),
        };

    } catch (error) {
        console.error('❌ Competitor Spy error:', error);

        return {
            success: false,
            insights: {} as CompetitorInsights,
            analyzedAt: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert uploaded file to base64 for API transmission
 */
export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Remove data:video/mp4;base64, prefix if present
            const base64 = result.split(',')[1] || result;
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Extract TikTok username from various input formats
 */
export function normalizeTikTokHandle(input: string): string {
    // Remove @ if present
    let handle = input.trim().replace('@', '');

    // Extract from URL if it's a profile URL
    if (handle.includes('tiktok.com')) {
        const match = handle.match(/@([^/?]+)/);
        if (match) {
            handle = match[1];
        }
    }

    return handle;
}

/**
 * Validate TikTok video URL format
 */
export function isValidTikTokUrl(url: string): boolean {
    const patterns = [
        /tiktok\.com\/@[\w.-]+\/video\/\d+/,
        /vm\.tiktok\.com\/[\w]+/,
        /vt\.tiktok\.com\/[\w]+/
    ];

    return patterns.some(pattern => pattern.test(url));
}

// Export for backward compatibility
export default {
    analyzeViralVideo,
    analyzeCompetitor,
    fileToBase64,
    normalizeTikTokHandle,
    isValidTikTokUrl,
};
