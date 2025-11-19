
import React, { useState } from 'react';
import { ScriptVariation } from '../types';
import { CheckCircle, Star, Layers } from 'lucide-react';

interface ScriptSelectionProps {
  scripts: ScriptVariation[];
  onFinalize: (selectedScripts: ScriptVariation[]) => void;
  researchSummary: string;
  isFaceless: boolean;
}

export const ScriptSelection: React.FC<ScriptSelectionProps> = ({ scripts, onFinalize, researchSummary, isFaceless }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleFinalize = () => {
    const selected = scripts.filter(s => selectedIds.includes(s.id));
    onFinalize(selected);
  };

  if (!scripts || scripts.length === 0) {
    return (
        <div className="text-center py-20">
            <p className="text-red-500 font-bold">No scripts generated. Please try again.</p>
        </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 pb-32">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {isFaceless ? 'Faceless Drafts Generated' : 'Viral Scripts Ready'}
        </h2>
        <p className="text-gray-500">Select one or more scripts to finalize.</p>
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
            const isRecommended = index === 0;
            const isSelected = selectedIds.includes(script.id);

            return (
              <div 
                key={script.id || index}
                onClick={() => toggleSelection(script.id)}
                className={`cursor-pointer bg-white rounded-2xl shadow-lg transition-all duration-300 border flex flex-col overflow-hidden relative group 
                    ${isSelected 
                        ? 'border-tiktok-teal ring-2 ring-tiktok-teal shadow-2xl scale-[1.02]' 
                        : isRecommended ? 'border-tiktok-pink/30' : 'border-gray-100 hover:border-gray-300'
                    }`}
              >
                {/* Selection Indicator */}
                <div className={`absolute top-4 right-4 z-20 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-tiktok-teal border-tiktok-teal' : 'bg-white border-gray-300'}`}>
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                </div>

                {isRecommended && (
                    <div className="absolute top-0 left-0 bg-tiktok-pink text-white text-xs font-bold px-3 py-1 rounded-br-xl z-10 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Top Pick
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
                </div>
              </div>
            )
        })}
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
             <div className="flex items-center gap-2">
                 <Layers className="w-5 h-5 text-tiktok-teal" />
                 <span className="font-bold text-gray-900">{selectedIds.length} Scripts Selected</span>
             </div>
             <button
                onClick={handleFinalize}
                disabled={selectedIds.length === 0}
                className={`px-8 py-3 rounded-full font-bold text-white transition-all ${
                    selectedIds.length > 0 
                    ? 'bg-gray-900 hover:bg-gray-800 shadow-lg' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
             >
                {selectedIds.length > 1 ? `Finalize ${selectedIds.length} Scripts` : 'Finalize Script'}
             </button>
          </div>
      </div>
    </div>
  );
};
