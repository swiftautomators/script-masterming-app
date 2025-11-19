
import React from 'react';
import { ScriptVariation } from '../types';
import { CheckCircle, Edit2, Star, MessageSquarePlus } from 'lucide-react';

interface ScriptSelectionProps {
  scripts: ScriptVariation[];
  onSelect: (script: ScriptVariation) => void;
  onEdit: (script: ScriptVariation) => void; 
  researchSummary: string;
}

export const ScriptSelection: React.FC<ScriptSelectionProps> = ({ scripts, onSelect, researchSummary }) => {
  if (!scripts || scripts.length === 0) {
    return (
        <div className="text-center py-20">
            <p className="text-red-500 font-bold">No scripts generated. Please try again.</p>
        </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 pb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Viral Scripts Are Ready</h2>
        <p className="text-gray-500">Choose the framework that fits your style best.</p>
      </div>

      {/* Research Insight Banner */}
      <div className="bg-white border-l-4 border-tiktok-teal p-6 rounded-r-xl shadow-sm mb-10 max-w-4xl mx-auto">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="bg-tiktok-teal/10 p-1 rounded text-tiktok-teal">🔍</span> 
            Market Intelligence
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{researchSummary.slice(0, 250)}...</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {scripts.map((script, index) => {
            // Simulate a recommendation logic (e.g. typically PAS is strong for products)
            const isRecommended = index === 0;

            return (
              <div 
                key={script.id || index}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border flex flex-col overflow-hidden relative group ${isRecommended ? 'border-tiktok-pink ring-2 ring-tiktok-pink/20 scale-[1.02]' : 'border-gray-100'}`}
              >
                {isRecommended && (
                    <div className="absolute top-0 right-0 bg-tiktok-pink text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Recommended
                    </div>
                )}
                
                <div className={`h-1.5 w-full ${index === 0 ? 'bg-tiktok-pink' : index === 1 ? 'bg-tiktok-teal' : 'bg-purple-500'}`}></div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1 block">Script {index + 1}</span>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">{script.framework}</h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{script.title}</p>
                  </div>

                  <div className="mb-5">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Hook Strategy</span>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-800 italic font-medium">"{script.hookStrategy}"</p>
                    </div>
                  </div>

                  <div className="flex-1 mb-6 min-h-[200px]">
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed font-medium">{script.content}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-auto pt-4">
                    <button
                      onClick={() => onSelect(script)}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                          isRecommended 
                          ? 'bg-tiktok-pink text-white hover:bg-pink-600 shadow-lg shadow-pink-200' 
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Select This Script
                    </button>
                    
                    <button className="w-full py-2.5 border border-gray-200 rounded-xl font-semibold text-sm text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                        <MessageSquarePlus className="w-4 h-4" />
                        Request Changes
                    </button>
                  </div>
                </div>
              </div>
            )
        })}
      </div>
    </div>
  );
};
