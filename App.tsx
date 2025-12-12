import React, { useState, useEffect } from 'react';
import { AppStep, VideoLength, ProductState, ScriptVariation, FinalScript, SavedScript, CompetitorAnalysis } from './types';
import { ScriptForm } from './components/ScriptForm';
import { ScriptSelection } from './components/ScriptSelection';
import { FinalOutputDisplay } from './components/FinalOutputDisplay';
import { LoadingState } from './components/LoadingState';
import { ScriptLibrary } from './components/ScriptLibrary';
import { LoginScreen } from './components/LoginScreen';
import { CompetitorAnalysisDisplay } from './components/CompetitorAnalysisDisplay';
import { researchProduct, generateDrafts, finalizeScriptData, repurposeViralScript, refineDraft, analyzeCompetitor } from './services/gemini';
import { generateScriptsViaAgents, finalizeScriptViaAgent } from './services/n8nAgents';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Play, BookOpen, LogOut } from 'lucide-react';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // App State
  const [step, setStep] = useState<AppStep>(AppStep.Input);
  const [loadingMessage, setLoadingMessage] = useState<{ title: string, sub: string }>({ title: "", sub: "" });
  const [error, setError] = useState<string | null>(null);

  const [product, setProduct] = useState<ProductState>({
    name: '',
    description: '',
    image: null,
    isFaceless: false
  });
  const [videoLength, setVideoLength] = useState<VideoLength>(VideoLength.Short);
  const [researchSummary, setResearchSummary] = useState<string>('');
  const [draftScripts, setDraftScripts] = useState<ScriptVariation[]>([]);
  const [finalScripts, setFinalScripts] = useState<FinalScript[]>([]);

  // Competitor State
  const [competitorReport, setCompetitorReport] = useState<CompetitorAnalysis | null>(null);

  // Viral State
  const [isViralMode, setIsViralMode] = useState(false);

  // Check for existing session and API key
  useEffect(() => {
    const storedAuth = localStorage.getItem('user_session_active');
    const storedKey = localStorage.getItem('user_gemini_api_key');

    // Ensure both auth flag AND api key exist to consider the user logged in
    if (storedAuth === 'true' && storedKey) {
      setIsAuthenticated(true);
    } else {
      // If state is inconsistent, clear auth
      localStorage.removeItem('user_session_active');
    }
    setIsAuthChecking(false);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('user_session_active', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session_active');
    // Note: We do NOT remove user_gemini_api_key here. 
    // We want to remember the device so the key isn't required on next login.
    setIsAuthenticated(false);
    resetApp();
  };

  const handleAIError = (e: any) => {
    console.error("AI Error Details:", e);

    const errStr = e?.toString()?.toLowerCase() || "";
    const message = e?.message?.toLowerCase() || "";
    let userMsg = "Something went wrong with the AI request.";

    // 1. Check for Definitive Authentication Errors
    const isAuthError =
      errStr.includes('401') || // Unauthorized
      message.includes('api key not valid') ||
      message.includes('api_key_invalid') ||
      message.includes('api key is missing');

    // 2. Check for Quota/Rate Limit Errors
    const isQuotaError =
      errStr.includes('429') ||
      errStr.includes('503') ||
      message.includes('resource_exhausted') ||
      message.includes('quota');

    if (isAuthError) {
      userMsg = "Access Denied: Your API Key appears to be invalid. Please log in again to update it.";
      localStorage.removeItem('user_gemini_api_key');
      localStorage.removeItem('user_session_active');
      setIsAuthenticated(false);
      alert(userMsg);
    } else if (isQuotaError) {
      userMsg = "⚠️ AI Traffic Jam: The service is experiencing high traffic. The app will auto-retry, but if this persists, please wait 1 minute.";
      // DO NOT reset step. Let user retry from current state.
      alert(userMsg);
    } else {
      userMsg = `Generation Error: ${e.message || "Please try again."}`;
      // DO NOT reset step.
      alert(userMsg);
    }
  };

  // Logic for Standard Flow
  const handleResearchAndGenerate = async () => {
    setStep(AppStep.Researching);
    setLoadingMessage({
      title: "🔍 Researching top-performing videos...",
      sub: "Scanning TikTok Shop for viral hooks and winning angles."
    });

    try {
      // Step 1: Research (Gemini Flash + Search)
      const research = await researchProduct(product.name, product.description, product.image);
      setResearchSummary(research.summary);

      setLoadingMessage({
        title: "🧠 Analyzing viral patterns...",
        sub: product.isFaceless
          ? "Analyzing top-performing faceless and aesthetic content..."
          : "Synthesizing market data to find the perfect sales angle."
      });

      // THROTTLING: Pause here to prevent "Requests Per Minute" limit issues.
      // Increased to 12s (Standard RPM limit is often 2-15 req/min).
      await new Promise(resolve => setTimeout(resolve, 12000));

      // Step 2: Draft (Gemini Flash + Thinking + RAG)
      setStep(AppStep.Drafting);
      setLoadingMessage({
        title: "💎 Accessing Viral Knowledge Base...",
        sub: "Retrieving high-converting voice patterns, hooks, and competitor intel."
      });

      // Visual delay for RAG context
      await new Promise(resolve => setTimeout(resolve, 1000));

      setLoadingMessage({
        title: "✍️ Crafting your conversion-focused scripts...",
        sub: product.isFaceless
          ? "Applying faceless frameworks (ASMR, POV, Aesthetic) to your product."
          : "Applying viral frameworks (PAS, BAB) with authentic voice patterns."
      });

      // Call n8n multi-agent system
      const agentResponse = await generateScriptsViaAgents({
        productName: product.name,
        productDescription: product.description, // Assuming description is available in product state or derived
        videoLength,
        isFaceless: product.isFaceless
      });

      if (!agentResponse.success) {
        setError(`Script generation failed. Please check:
        
      1. n8n workflows are active
      2. All 5 workflows are running
      3. Webhook URLs are correct
      
      Debug info:
      ${JSON.stringify(agentResponse.debugInfo, null, 2)}
      
      Error: ${agentResponse.error}
        `);
        setStep(AppStep.Input); // Reset step to input so they can see the error and retry
        setLoadingMessage({ title: "", sub: "" }); // Clear loading
        return;
      }

      setResearchSummary(agentResponse.researchSummary);
      setDraftScripts(agentResponse.scripts);

      setStep(AppStep.Selection);
    } catch (e) {
      handleAIError(e);
      // If failed during research/drafting, we might want to go back to input
      if (step === AppStep.Researching || step === AppStep.Drafting) {
        setStep(AppStep.Input);
      }
    }
  };

  // Logic for Viral Repurpose Flow
  const handleViralAnalysis = async (url: string, script: string) => {
    setStep(AppStep.Researching);
    setLoadingMessage({
      title: "🔥 Deconstructing Viral DNA...",
      sub: "Analyzing psychological triggers, retention mechanisms, and hook structures."
    });

    try {
      if (!product.name) {
        setProduct(prev => ({ ...prev, name: "Viral Product" }));
      }

      const result = await repurposeViralScript(script);

      setResearchSummary(result.analysis);
      setDraftScripts(result.scripts);

      setStep(AppStep.Selection);

    } catch (e) {
      handleAIError(e);
      setStep(AppStep.Input);
    }
  };

  // Logic for Competitor Analysis
  const handleCompetitorAnalysis = async (handle: string) => {
    setStep(AppStep.Researching); // Reusing the loading step visual
    setLoadingMessage({
      title: "🕵️ Spying on Competitor...",
      sub: "Analyzing their hooks, sales tactics, and audience sentiment using Google Search."
    });

    try {
      const result = await analyzeCompetitor(handle);
      setCompetitorReport(result);
      setStep(AppStep.CompetitorReport);
    } catch (e) {
      handleAIError(e);
      setStep(AppStep.Input);
    }
  };

  const handleUseLibraryPattern = (script: SavedScript) => {
    setIsViralMode(true);
    setProduct(prev => ({ ...prev, name: script.productName }));
    setStep(AppStep.Input);
  };

  const handleAddViralScript = () => {
    setIsViralMode(true);
    setStep(AppStep.Input);
  };

  const handleRefineScript = async (scriptId: number, instructions: string) => {
    const scriptToRefine = draftScripts.find(s => s.id === scriptId);
    if (!scriptToRefine) return;

    const originalContent = scriptToRefine.content;

    try {
      const refinedContent = await refineDraft(originalContent, instructions);

      setDraftScripts(prev => prev.map(s =>
        s.id === scriptId ? { ...s, content: refinedContent } : s
      ));
    } catch (e) {
      handleAIError(e);
    }
  };

  const handleSelectScripts = async (scripts: ScriptVariation[]) => {
    setStep(AppStep.Finalizing);
    setLoadingMessage({
      title: `Polishing ${scripts.length} Script${scripts.length > 1 ? 's' : ''}...`,
      sub: `Optimizing ${product.isFaceless ? 'visual transitions and text overlays' : 'visual cues and captions'}.`
    });

    const finals: FinalScript[] = [];
    const errors: string[] = [];

    // Process sequentially to be polite to API
    for (const script of scripts) {
      try {
        // Increased delay to 10s to ensure we stay under strict RPM limits
        if (finals.length > 0) await new Promise(r => setTimeout(r, 10000));

        const final = await finalizeScriptViaAgent({
          scriptId: script.id,
          scriptContent: script.content,
          productName: product.name,
          category: 'fashion', // This will be dynamic from agentResponse - wait, needed to store category. For now hardcode or pass through.
          framework: script.framework,
          isFaceless: product.isFaceless
        });

        if (final) {
          finals.push(final);
        } else {
          throw new Error('Failed to finalize script');
        }
      } catch (e: any) {
        console.error(`Failed to finalize script ${script.id}`, e);
        errors.push(`Script ${script.id}: ${e.message}`);
      }
    }

    if (finals.length > 0) {
      setFinalScripts(finals);
      setStep(AppStep.Result);
      if (errors.length > 0) {
        alert(`Completed with warnings: ${errors.length} scripts failed to finalize.`);
      }
    } else {
      // All failed
      handleAIError(new Error("Failed to finalize any selected scripts. Please try again."));
      setStep(AppStep.Selection); // Go back to selection so they can retry
    }
  };

  const resetApp = () => {
    setProduct({ name: '', description: '', image: null, isFaceless: false });
    setStep(AppStep.Input);
    setFinalScripts([]);
    setDraftScripts([]);
    setIsViralMode(false);
    setCompetitorReport(null);
  };

  if (isAuthChecking) {
    return null; // Or a simple spinner
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={resetApp}>
            <div className="bg-tiktok-black text-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Script<span className="text-tiktok-pink">Mastermind</span></h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep(AppStep.Library)}
              className={`text-sm font-bold flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${step === AppStep.Library ? 'bg-gray-100 text-tiktok-teal' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <BookOpen className="w-4 h-4" /> My Library
            </button>
            {step !== AppStep.Input && step !== AppStep.Library && (
              <button onClick={resetApp} className="text-xs font-semibold text-gray-500 hover:text-tiktok-black px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all border border-gray-200">
                New Project
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="py-8 px-4">
        {/* Error Display */}
        <ErrorDisplay error={error} onRetry={() => setError(null)} />

        {/* Step 1: Input */}
        {step === AppStep.Input && (
          <div className="animate-fade-in">
            <div className="text-center mb-12 pt-4">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                Convert Views to <span className="text-transparent bg-clip-text bg-gradient-to-r from-tiktok-teal to-tiktok-pink">Sales</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                Generate high-converting TikTok Shop scripts in seconds using AI market research.
              </p>
            </div>
            <ScriptForm
              product={product}
              setProduct={setProduct}
              videoLength={videoLength}
              setVideoLength={setVideoLength}
              onSubmit={handleResearchAndGenerate}
              isSubmitting={false}
              isViralMode={isViralMode}
              setIsViralMode={setIsViralMode}
              onViralSubmit={handleViralAnalysis}
              onCompetitorAnalyze={handleCompetitorAnalysis}
            />
          </div>
        )}

        {/* Loading Steps */}
        {(step === AppStep.Researching || step === AppStep.Drafting || step === AppStep.Finalizing) && (
          <LoadingState
            message={loadingMessage.title}
            subMessage={loadingMessage.sub}
          />
        )}

        {/* Step 3: Selection */}
        {step === AppStep.Selection && (
          <ScriptSelection
            scripts={draftScripts}
            researchSummary={researchSummary}
            onFinalize={handleSelectScripts}
            onRequestChanges={handleRefineScript}
            isFaceless={product.isFaceless}
            isViralMode={isViralMode}
          />
        )}

        {/* Step 4: Result */}
        {step === AppStep.Result && finalScripts.length > 0 && (
          <FinalOutputDisplay
            finalScripts={finalScripts}
            onReset={resetApp}
          />
        )}

        {/* Competitor Report Step */}
        {step === AppStep.CompetitorReport && competitorReport && (
          <CompetitorAnalysisDisplay
            analysis={competitorReport}
            onBack={resetApp}
          />
        )}

        {/* Library Step */}
        {step === AppStep.Library && (
          <ScriptLibrary
            onUsePattern={handleUseLibraryPattern}
            onAddViralScript={handleAddViralScript}
          />
        )}
      </main>

      <footer className="text-center py-10 text-gray-400 text-xs">
        <p>© 2024 TikTok Shop Script Mastermind. Powered by Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

export default App;
