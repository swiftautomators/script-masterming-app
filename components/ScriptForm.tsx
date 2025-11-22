
import React, { useRef, useState } from 'react';
import { VideoLength, ProductState } from '../types';
import { Camera, X, Clock, Ghost, Flame, Upload, Search, Eye, ShieldAlert } from 'lucide-react';
import { transcribeMedia, transcribeUrl } from '../services/gemini';

interface ScriptFormProps {
  product: ProductState;
  setProduct: (p: ProductState) => void;
  videoLength: VideoLength;
  setVideoLength: (l: VideoLength) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  
  // Viral Script Props
  isViralMode: boolean;
  setIsViralMode: (v: boolean) => void;
  onViralSubmit: (url: string, script: string) => void;

  // Competitor Props
  onCompetitorAnalyze: (handle: string) => void;
}

const LENGTH_DESCRIPTIONS: Record<VideoLength, string> = {
  [VideoLength.Short]: "Highest conversion rate",
  [VideoLength.Medium]: "Balanced storytelling",
  [VideoLength.Long]: "Deep engagement",
  [VideoLength.ExtraLong]: "Tutorial-style",
  [VideoLength.DeepDive]: "In-depth education"
};

type FormMode = 'normal' | 'viral' | 'competitor';

export const ScriptForm: React.FC<ScriptFormProps> = ({
  product,
  setProduct,
  videoLength,
  setVideoLength,
  onSubmit,
  isSubmitting,
  isViralMode,
  setIsViralMode,
  onViralSubmit,
  onCompetitorAnalyze
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viralFileInputRef = useRef<HTMLInputElement>(null);
  
  const [mode, setMode] = useState<FormMode>(isViralMode ? 'viral' : 'normal');

  // Viral State
  const [viralUrl, setViralUrl] = useState('');
  const [viralScript, setViralScript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Competitor State
  const [competitorHandle, setCompetitorHandle] = useState('');

  const handleModeChange = (newMode: FormMode) => {
    setMode(newMode);
    setIsViralMode(newMode === 'viral');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setProduct({ ...product, image: base64Data });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViralFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Check validity
      if (!file.type.startsWith('video/') && !file.type.startsWith('audio/')) {
          alert("Please upload a video (MP4) or audio (MP3) file.");
          return;
      }

      setIsTranscribing(true);
      try {
          const reader = new FileReader();
          reader.onloadend = async () => {
              const base64String = reader.result as string;
              const base64Data = base64String.split(',')[1];
              
              const transcript = await transcribeMedia(base64Data, file.type);
              setViralScript(transcript);
              setIsTranscribing(false);
          };
          reader.readAsDataURL(file);
      } catch (error) {
          console.error(error);
          alert("Could not transcribe file. Please try again.");
          setIsTranscribing(false);
      }
  };

  const handleUrlTranscription = async () => {
      if (!viralUrl) return;
      setIsTranscribing(true);
      try {
          const transcript = await transcribeUrl(viralUrl);
          setViralScript(transcript);
      } catch (error) {
          console.error(error);
          alert("Could not analyze URL. Try pasting the script manually.");
      } finally {
          setIsTranscribing(false);
      }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* MODE SELECTOR */}
      <div className="flex gap-2 bg-white p-2 rounded-xl shadow-md border border-gray-100">
         <button 
            onClick={() => handleModeChange('normal')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${mode === 'normal' ? 'bg-tiktok-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
         >
            Script Generator
         </button>
         <button 
            onClick={() => handleModeChange('viral')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${mode === 'viral' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:bg-red-50 hover:text-red-500'}`}
         >
            <Flame className="w-4 h-4" /> Viral Re-Purpose
         </button>
         <button 
            onClick={() => handleModeChange('competitor')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${mode === 'competitor' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
         >
            <ShieldAlert className="w-4 h-4" /> Competitor Spy
         </button>
      </div>

      {/* COMPETITOR SPY MODE */}
      {mode === 'competitor' && (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-indigo-100 animate-fade-in">
           <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
              <ShieldAlert className="text-indigo-600" /> Competitor Deep Dive
           </h3>
           <p className="text-gray-500 mb-8">Analyze a competitor's handle or video to uncover their secrets and beat them.</p>

           <div className="mb-8">
              <label className="block text-sm font-bold text-gray-800 mb-2">TikTok Handle or Video URL</label>
              <div className="flex gap-2">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={competitorHandle}
                        onChange={(e) => setCompetitorHandle(e.target.value)}
                        placeholder="@competitor or https://tiktok.com/video/..."
                        className="w-full pl-10 pr-5 py-4 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                    />
                 </div>
              </div>
           </div>

           <button
              onClick={() => onCompetitorAnalyze(competitorHandle)}
              disabled={isSubmitting || !competitorHandle}
              className={`w-full py-5 rounded-xl text-white font-bold text-xl shadow-lg transition-all
                  ${isSubmitting || !competitorHandle
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-xl transform hover:scale-[1.01]'
                  }
              `}
           >
              {isSubmitting ? 'Analyzing Spy Data...' : 'Analyze Competitor'}
           </button>
        </div>
      )}

      {/* VIRAL MODE */}
      {mode === 'viral' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-red-100 animate-fade-in">
             <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Flame className="text-red-500" /> Viral Script Iterator
             </h3>
             
             {/* URL Input */}
             <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2">TikTok Video URL</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={viralUrl}
                        onChange={(e) => setViralUrl(e.target.value)}
                        placeholder="https://www.tiktok.com/@..."
                        className="flex-1 px-5 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder-gray-400"
                    />
                    <button 
                        onClick={handleUrlTranscription}
                        disabled={isTranscribing || !viralUrl}
                        className="px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Search className="w-4 h-4" /> Auto-Fill
                    </button>
                </div>
             </div>

             {/* File Upload for Transcription */}
             <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2">OR Import Video/Audio File</label>
                <div 
                    onClick={() => viralFileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all group"
                >
                    <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-red-500" />
                    <p className="text-sm text-gray-500 font-medium">Click to upload MP4 or MP3</p>
                    <p className="text-xs text-gray-400">We'll transcribe it automatically</p>
                    <input 
                        type="file" 
                        ref={viralFileInputRef}
                        onChange={handleViralFileUpload}
                        accept="video/*,audio/*"
                        className="hidden"
                    />
                </div>
             </div>

             {/* Script Text Area */}
             <div className="mb-8 relative">
                <label className="block text-sm font-bold text-gray-800 mb-2">Script Content</label>
                {isTranscribing && (
                    <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center rounded-xl">
                        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <span className="text-red-600 font-bold text-sm">Transcribing media...</span>
                    </div>
                )}
                <textarea
                    value={viralScript}
                    onChange={(e) => setViralScript(e.target.value)}
                    placeholder="Paste the script here or use the tools above to import..."
                    rows={6}
                    className="w-full px-5 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none placeholder-gray-400"
                />
             </div>

             <button
                onClick={() => onViralSubmit(viralUrl, viralScript)}
                disabled={isSubmitting || !viralScript || isTranscribing}
                className={`w-full py-5 rounded-xl text-white font-bold text-xl shadow-lg transition-all
                    ${isSubmitting || !viralScript || isTranscribing
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 hover:shadow-xl transform hover:scale-[1.01]'
                    }
                `}
             >
                {isSubmitting ? 'Analyzing DNA...' : 'Analyze & Iterate'}
             </button>
          </div>
      )}

      {/* STANDARD INPUT FORM */}
      {mode === 'normal' && (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fade-in">
        
        {/* Image Upload */}
        <div className="mb-8">
            <label className="block text-sm font-bold text-gray-800 mb-3">Product Visuals</label>
            <div className="flex justify-center">
            {product.image ? (
                <div className="relative w-full h-56 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <img 
                    src={`data:image/png;base64,${product.image}`} 
                    alt="Product" 
                    className="w-full h-full object-contain" 
                />
                <button 
                    onClick={() => setProduct({...product, image: null})}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
                >
                    <X className="w-5 h-5 text-red-500" />
                </button>
                </div>
            ) : (
                <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-tiktok-pink hover:text-tiktok-pink hover:bg-pink-50/50 transition-all group"
                >
                <Camera className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Upload photo to Analyze</span>
                </button>
            )}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
            />
            </div>
        </div>

        {/* Product Name */}
        <div className="mb-6">
            <label className="block text-sm font-bold text-gray-800 mb-2">Product Name</label>
            <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="e.g., Galaxy Star Projector"
            className="w-full px-5 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-tiktok-teal focus:border-tiktok-teal outline-none transition-all placeholder-gray-400 shadow-sm"
            />
        </div>

        {/* Description */}
        <div className="mb-6">
            <label className="block text-sm font-bold text-gray-800 mb-2">Product Details</label>
            <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            placeholder="Paste TikTok Shop product URL or describe your product (e.g., 'wireless bluetooth headphones under $50 for working out')"
            rows={4}
            className="w-full px-5 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-tiktok-teal focus:border-tiktok-teal outline-none transition-all resize-none placeholder-gray-400 shadow-sm"
            />
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-bold text-[10px]">PRO TIP</span> 
            The more specific you are, the better your scripts will be!
            </p>
        </div>

        {/* Faceless Toggle */}
        <div className="mb-8 bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm text-gray-800">
                    <Ghost className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">Faceless Video Mode</h4>
                    <p className="text-xs text-gray-500">Generate scripts optimized for aesthetic, POV, or ASMR visuals.</p>
                </div>
            </div>
            <label className="inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={product.isFaceless} 
                    onChange={(e) => setProduct({...product, isFaceless: e.target.checked})} 
                    className="sr-only peer" 
                />
                <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-tiktok-pink peer-checked:to-tiktok-teal"></div>
            </label>
        </div>

        {/* Video Length */}
        <div className="mb-10">
            <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Target Video Length
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {Object.values(VideoLength).map((len) => (
                <button
                key={len}
                onClick={() => setVideoLength(len)}
                className={`relative flex flex-col items-center justify-center p-2 h-20 rounded-xl border transition-all duration-200 ${
                    videoLength === len
                    ? 'bg-tiktok-black text-white border-tiktok-black shadow-lg scale-105 z-10'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                }`}
                >
                <span className="text-sm font-bold mb-1">{len.split(' ')[0]}</span>
                <span className={`text-[10px] leading-tight text-center ${videoLength === len ? 'text-gray-300' : 'text-gray-400'}`}>
                    {LENGTH_DESCRIPTIONS[len]}
                </span>
                </button>
            ))}
            </div>
        </div>

        <button
            onClick={onSubmit}
            disabled={isSubmitting || !product.name}
            className={`w-full py-5 rounded-xl text-white font-bold text-xl shadow-xl transform transition-all relative overflow-hidden group ${
            isSubmitting || !product.name
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] hover:shadow-2xl hover:scale-[1.02]'
            }`}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? 'Generating...' : 'Research & Script'}
            </span>
            {!isSubmitting && product.name && (
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            )}
        </button>
        </div>
      )}
    </div>
  );
};
