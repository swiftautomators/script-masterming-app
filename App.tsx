
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
import { Play, BookOpen, LogOut } from 'lucide-react';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // App State
  const [step, setStep] = useState<AppStep>(AppStep.Input);
  const [loadingMessage, setLoadingMessage] = useState<{title: string, sub: string}>({ title: "", sub: "" });
  
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
    const storedAuth = localStorage.getItem('tiktok_mastermind_auth');
    const storedApiKey = localStorage.getItem('tiktok_mastermind_api_key');

    if (storedAuth === 'Loki2024_VALID_SESSION') {
      // Ensure we also have an API key available (stored)
      if (storedApiKey && storedApiKey.length > 0) {
        setIsAuthenticated(true);
      } else {
        // Session exists but no API key - require login to prompt for key
        setIsAuthenticated(false);
      }
    }
    setIsAuthChecking(false);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('tiktok_mastermind_auth', 'Loki2024_VALID_SESSION');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('tiktok_mastermind_auth');
    // We intentionally DO NOT clear the API key here to "remember device"
    // localStorage.removeItem('tiktok_mastermind_api_key'); 
    setIsAuthenticated(false);
    resetApp();
  };

  const handleAIError = (e: any) => {
    console.error(e);
    let msg = "Something went wrong with the AI request.";
    const errStr = e?.toString()?.toLowerCase() || "";
    
    if (errStr.includes('403') || errStr.includes('401') || errStr.includes('permission') || errStr.includes('key')) {
         msg = "API Key Invalid or Expired.";
         // Force clear key so user can re-enter
         localStorage.removeItem('tiktok_mastermind_api_key');
         setIsAuthenticated(false);
    } else if (errStr.includes('quota') || errStr.includes('429')) {
         msg = "API Quota Exceeded. Please try again later.";
    }
    
    alert(`${msg} Please check your API Key and try again.`);
    setStep(AppStep.Input);
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

      // Short delay to let user read the transition
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Draft (Gemini Pro + Thinking + RAG)
      setStep(AppStep.Drafting);
      setLoadingMessage({
        title: "💎 Accessing Viral Knowledge Base...",
        sub: "Retrieving high-converting voice patterns, hooks, and competitor intel."
      });

      // Artificial delay to show the RAG step
      await new Promise(resolve => setTimeout(resolve, 1000));

      setLoadingMessage({
        title: "✍️ Crafting your conversion-focused scripts...",
        sub: product.isFaceless 
            ? "Applying faceless frameworks (ASMR, POV, Aesthetic) to your product." 
            : "Applying viral frameworks (PAS, BAB) with authentic voice patterns."
      });

      const drafts = await generateDrafts(product.name, videoLength, research.summary, product.isFaceless);
      setDraftScripts(drafts);
      
      setStep(AppStep.Selection);
    } catch (e) {
      handleAIError(e);
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
        // Since product name might be empty in viral mode, set a fallback for finalization context later
        if (!product.name) {
            setProduct(prev => ({...prev, name: "Viral Product"}));
        }

        const result = await repurposeViralScript(script);
        
        setResearchSummary(result.analysis);
        setDraftScripts(result.scripts);
        
        setStep(AppStep.Selection);

     } catch (e) {
        handleAIError(e);
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
    }
  };

  const handleUseLibraryPattern = (script: SavedScript) => {
    // Use the library script pattern to jumpstart the viral mode
    setIsViralMode(true);
    setProduct(prev => ({...prev, name: script.productName}));
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
     
     // Optimistic UI update or Loading indicator could go here
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

    try {
      // Process all selected scripts in parallel
      const promises = scripts.map(script => finalizeScriptData(script, product.name, product.isFaceless));
      const finals = await Promise.all(promises);
      
      setFinalScripts(finals);
      setStep(AppStep.Result);
    } catch (e) {
      handleAIError(e);
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
        <p>© 2024 TikTok Shop Script Mastermind. Powered by Gemini 3 Pro & Search.</p>
      </footer>
    </div>
  );
};

export default App;
