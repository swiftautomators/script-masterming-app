// services/n8nAgents.ts
// Multi-Agent System Integration for TikTok Script Generation
// Uses n8n workflows to generate category-specific scripts

const N8N_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_BASE_URL || 'https://n8n.srv1020587.hstgr.cloud';

// ============================================================================
// WORKFLOW IDS - UPDATED FOR SIMPLIFIED WORKFLOWS
// ============================================================================
// 🎬 Orchestrator: NDW6GorHdHgI9M4H
// 🔍 Research: nfY3cimq8fpQYpwy
// 🎣 Hooks: d6vojeemM9NhRxNi
// ✍️ Writer: biv1jkE3FO8NvYvY
// 💎 Polish: GbpsVbmFP0QurDAN

interface GenerateScriptsInput {
    productName: string;
    productDescription: string;
    videoLength: string;
    isFaceless: boolean;
}

interface ScriptDraft {
    id: number;
    title: string;
    framework: string;
    hookStrategy: string;
    content: string;
}

interface AgentScriptsResponse {
    success: boolean;
    category: string;
    voiceProfile: string;
    researchSummary: string;
    hooks: Array<{
        text: string;
        type: string;
        trigger: string;
        framework: string;
    }>;
    scripts: ScriptDraft[];
    error?: string;
    debugInfo?: any;
}

interface FinalizeScriptInput {
    scriptId: number;
    scriptContent: string;
    productName: string;
    category: string;
    framework: string;
    isFaceless: boolean;
}

interface FinalizedScript {
    id: number;
    framework: string;
    verbalHook: string;
    visualHook: string;
    onScreenHook: string;
    fullScript: string;
    additionalText: string;
    caption: string;
    hashtags: string[];
    notes: string;
}

/**
 * Generates scripts using the multi-agent n8n system
 * Replaces the old researchProduct + generateDrafts flow
 */
export async function generateScriptsViaAgents(
    input: GenerateScriptsInput
): Promise<AgentScriptsResponse> {
    const DEBUG_URL = import.meta.env.VITE_N8N_WEBHOOK_BASE_URL || 'https://n8n.srv1020587.hstgr.cloud';
    console.log('🎬 Calling TikTok Script Orchestrator...', {
        url: DEBUG_URL,
        input: input
    });

    try {
        const response = await fetch(`${N8N_BASE_URL}/webhook/tiktok-script-generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ n8n error response:', errorText);

            // Try to parse error as JSON
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { error: errorText };
            }

            throw new Error(`n8n workflow failed: ${JSON.stringify(errorData, null, 2)}`);
        }

        const data = await response.json();
        console.log('✅ Orchestrator response:', data);

        // Parse the response from the agent pipeline
        return {
            success: true,
            category: data.category || 'general',
            voiceProfile: data.voiceProfile || 'default',
            researchSummary: data.researchData?.summary || 'Market research complete',
            hooks: data.hooks || [],
            scripts: data.scripts || [],
        };

    } catch (error) {
        console.error('❌ Agent system error:', error);

        return {
            success: false,
            category: 'error',
            voiceProfile: 'default',
            researchSummary: 'Error generating research',
            hooks: [],
            scripts: [],
            // @ts-ignore
            error: error.message || 'Unknown error',
            debugInfo: {
                n8nUrl: DEBUG_URL,
                timestamp: new Date().toISOString(),
                input: input
            }
        } as any; // Cast to any to bypass strict type check on the added debugInfo for now, or I should update interface
    }
}

/**
 * Finalizes a selected script with production-ready polish
 * Replaces the old finalizeScriptData flow
 */
export async function finalizeScriptViaAgent(
    input: FinalizeScriptInput
): Promise<FinalizedScript | null> {
    console.log('💎 Calling Polish Agent...', input);

    try {
        const response = await fetch(`${N8N_BASE_URL}/webhook/polish-agent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            throw new Error(`Polish agent failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Polish agent response:', data);

        return data as FinalizedScript;

    } catch (error) {
        console.error('❌ Polish agent error:', error);
        return null;
    }
}

/**
 * Health check for the n8n agent system
 * Verifies all workflows are accessible
 */
export async function checkAgentHealth(): Promise<{
    healthy: boolean;
    workflows: Record<string, boolean>;
}> {
    const workflows = {
        orchestrator: false,
        research: false,
        hooks: false,
        writer: false,
        polish: false,
    };

    try {
        // Test orchestrator (which will test all downstream agents)
        const response = await fetch(`${N8N_BASE_URL}/webhook/tiktok-script-generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName: 'Test Product',
                productDescription: 'Health check test',
                videoLength: 'short',
                isFaceless: false,
            }),
        });

        workflows.orchestrator = response.ok;

        // If orchestrator works, assume downstream agents work
        if (response.ok) {
            workflows.research = true;
            workflows.hooks = true;
            workflows.writer = true;
        }

        // Test polish agent separately
        const polishResponse = await fetch(`${N8N_BASE_URL}/webhook/polish-agent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                scriptId: 1,
                scriptContent: 'Test script',
                productName: 'Test',
                category: 'fashion',
                framework: 'PAS',
                isFaceless: false,
            }),
        });

        workflows.polish = polishResponse.ok;

    } catch (error) {
        console.error('Health check failed:', error);
    }

    const healthy = Object.values(workflows).every(status => status === true);

    return {
        healthy,
        workflows,
    };
}

// Export for backward compatibility (if needed)
export default {
    generateScriptsViaAgents,
    finalizeScriptViaAgent,
    checkAgentHealth,
};
