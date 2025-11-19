
import React from 'react';
import { FinalScript } from '../types';
import { Copy, Download, Share2, Sparkles, Mic, Eye, Smartphone, FileText, Hash, Lightbulb } from 'lucide-react';

interface FinalOutputDisplayProps {
  finalScript: FinalScript;
  onReset: () => void;
}

export const FinalOutputDisplay: React.FC<FinalOutputDisplayProps> = ({ finalScript, onReset }) => {
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Ideally add a toast here, but standard alert for now is too intrusive, so we just copy silently or assume UI feedback isn't critical for this prompt scope.
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const fileContent = `
TIKTOK SHOP SCRIPT MASTERMIND
-----------------------------

VERBAL HOOK:
${finalScript.verbalHook}

VISUAL HOOK:
${finalScript.visualHook}

FULL SCRIPT:
${finalScript.fullScript}

ON-SCREEN TEXT:
${finalScript.additionalText}

CAPTION:
${finalScript.caption}

HASHTAGS:
${finalScript.hashtags.join(' ')}

NOTES:
${finalScript.notes}
    `;
    const file = new Blob([fileContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "tiktok-script.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My TikTok Script',
          text: finalScript.fullScript,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      copyToClipboard(finalScript.fullScript);
      alert("Script copied to clipboard!");
    }
  };

  const SectionHeader = ({ icon: Icon, title, onCopy }: { icon: any, title: string, onCopy?: () => void }) => (
    <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wide">
            <div className="p-1.5 bg-gray-100 rounded-md text-gray-600">
                <Icon className="w-4 h-4" />
            </div>
            {title}
        </h4>
        {onCopy && (
            <button 
                onClick={onCopy} 
                className="text-xs font-medium text-gray-400 hover:text-tiktok-teal flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-gray-50"
            >
                <Copy className="w-3 h-3" /> Copy
            </button>
        )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-32 px-4">
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-tiktok-teal text-white mb-6 shadow-lg shadow-green-100">
          <Sparkles className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-2">Script Finalized</h2>
        <p className="text-gray-500 text-lg">Ready to film your viral video.</p>
      </div>

      <div className="flex gap-3 mb-8 justify-center">
         <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Download .txt
         </button>
         <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Share2 className="w-4 h-4" /> Share
         </button>
      </div>

      {/* The Hooks */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900 text-lg">The Hook Strategy</h3>
        </div>
        <div className="p-6 space-y-8">
            <div>
                <SectionHeader icon={Mic} title="Verbal Hook (Audio)" onCopy={() => copyToClipboard(finalScript.verbalHook)} />
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-lg font-bold text-gray-900">"{finalScript.verbalHook}"</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <SectionHeader icon={Eye} title="Visual Hook" onCopy={() => copyToClipboard(finalScript.visualHook)} />
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">{finalScript.visualHook}</p>
                </div>
                <div>
                    <SectionHeader icon={Smartphone} title="On-Screen Text (0-3s)" onCopy={() => copyToClipboard(finalScript.onScreenHook)} />
                    <div className="bg-black p-3 rounded-lg text-center shadow-lg transform rotate-1">
                        <p className="text-white font-bold text-lg tracking-wide">{finalScript.onScreenHook}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Full Script */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
             <SectionHeader icon={FileText} title="Full Script" onCopy={() => copyToClipboard(finalScript.fullScript)} />
        </div>
        <div className="p-8">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 text-lg leading-relaxed pl-4 border-l-4 border-tiktok-pink/20">
                {finalScript.fullScript}
            </pre>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <SectionHeader icon={Smartphone} title="Text Overlays" onCopy={() => copyToClipboard(finalScript.additionalText)} />
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{finalScript.additionalText}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
             <SectionHeader icon={Hash} title="Caption & Hashtags" onCopy={() => copyToClipboard(`${finalScript.caption} ${finalScript.hashtags.join(' ')}`)} />
             <p className="text-sm text-gray-800 mb-4 font-medium">{finalScript.caption}</p>
             <div className="flex flex-wrap gap-2">
                {finalScript.hashtags?.map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-blue-600 px-2.5 py-1 rounded-md font-semibold">
                        #{tag.replace(/#/g, '')}
                    </span>
                ))}
             </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 mb-8">
         <SectionHeader icon={Lightbulb} title="Director's Notes" />
         <p className="text-yellow-900 text-sm leading-relaxed">{finalScript.notes}</p>
      </div>

      <button
        onClick={onReset}
        className="w-full py-5 bg-white border-2 border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all"
      >
        Start New Script
      </button>
    </div>
  );
};
