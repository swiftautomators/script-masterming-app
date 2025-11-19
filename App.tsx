
import React, { useState } from 'react';
import { AppStep, VideoLength, ProductState, ScriptVariation, FinalScript } from './types';
import { ScriptForm } from './components/ScriptForm';
import { ScriptSelection } from './components/ScriptSelection';
import { FinalOutputDisplay } from './components/FinalOutputDisplay';
import { LoadingState } from './components/LoadingState';
import { researchProduct, generateDrafts, finalizeScriptData } from './services/gemini';
import { Play } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.Input);
  const [loadingMessage, setLoadingMessage] = useState<{title: string, sub: string}>({ title: "", sub: "" });
  
  // State
  const [product, setProduct] = useState<ProductState>({ 
    name: '', 
    description: '', 
    image: null, 
    isFaceless: false 
  });
  const [videoLength, setVideoLength] = useState<VideoLength>(VideoLength.Short);
  const [researchSummary, setResearchSummary] = useState<string>('');
  const [draftScripts, setDraftScripts] = useState<ScriptVariation[]>([]);
  const [finalScripts, setFinalScripts] = useState<FinalScript[]>([]); // Array of finalized scripts

  // Logic
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

      // Step 2: Draft (Gemini Pro + Thinking)
      setStep(AppStep.Drafting);
      setLoadingMessage({
        title: "✍️ Crafting your conversion-focused scripts...",
        sub: product.isFaceless 
            ? "Applying faceless frameworks (ASMR, POV, Aesthetic) to your product." 
            : "Applying viral frameworks (PAS, BAB) to your product."
      });

      const drafts = await generateDrafts(product.name, videoLength, research.summary, product.isFaceless);
      setDraftScripts(drafts);
      
      setStep(AppStep.Selection);
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please ensure your API KEY is set in the environment.");
      setStep(AppStep.Input);
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
      console.error(e);
      alert("Failed to finalize scripts. Try again.");
      setStep(AppStep.Selection);
    }
  };

  const resetApp = () => {
    setProduct({ name: '', description: '', image: null, isFaceless: false });
    setStep(AppStep.Input);
    setFinalScripts([]);
    setDraftScripts([]);
  };

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
          {step !== AppStep.Input && (
            <button onClick={resetApp} className="text-xs font-semibold text-gray-500 hover:text-tiktok-black px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all">
              New Project
            </button>
          )}
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
            isFaceless={product.isFaceless}
          />
        )}

        {/* Step 4: Result */}
        {step === AppStep.Result && finalScripts.length > 0 && (
          <FinalOutputDisplay 
            finalScripts={finalScripts}
            onReset={resetApp}
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
