
import React, { useState } from 'react';
import { ScriptVariation } from '../types';
import { CheckCircle, Star, Layers, Flame, Zap, Edit3, Send } from 'lucide-react';

interface ScriptSelectionProps {
  scripts: ScriptVariation[];
  onFinalize: (selectedScripts: ScriptVariation[]) => void;
  onRequestChanges?: (id: number, instructions: string) => void;
  researchSummary: string;
  isFaceless: boolean;
  isViralMode?: boolean;
}

export const ScriptSelection: React.FC<ScriptSelectionProps> = ({ scripts, onFinalize, onRequestChanges, researchSummary, isFaceless, isViralMode = false }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editInstructions, setEditInstructions] = useState('');

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
  
  const submitChanges = (id: number) => {
    if (onRequestChanges && editInstructions.trim()) {
        onRequestChanges(id, editInstructions);
        setEditingId(null);
        setEditInstructions('');
    }
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
        <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            {isViralMode && <Flame className="text-red-600 w-8 h-8" />}
            {isViralMode 
              ? 'Viral Script Analysis'
              : isFaceless ? 'Faceless Drafts Generated' : 'Viral Scripts Ready'
            }
        </h2>
        <p className="text-gray-500">
          {isViralMode ? 'Review the analysis and select an iteration to finalize.' : 'Select one or more scripts to finalize.'}
        </p>
      </div>

      {/* Research/Analysis Insight Banner */}
      <div className={`border-l-4 p-6 rounded-r-xl shadow-sm mb-10 max-w-4xl mx-auto ${isViralMode ? 'bg-red-50 border-red-500' : 'bg-white border-tiktok-teal'}`}>
        <h3 className={`font-bold mb-2 flex items-center gap-2 ${isViralMode ? 'text-red-700' : 'text-gray-900'}`}>
            {isViralMode ? (
              <>
                <span className="bg-red-100 p-1 rounded text-red-600"><Zap className="w-4 h-4" /></span>
                Performance Insights (Why it worked)
              </>
            ) : (
              <>
                <span className="bg-tiktok-teal/10 p-1 rounded text-tiktok-teal">🔍</span> 
                Market Intelligence
              </>
            )}
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed font-medium">{researchSummary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {scripts.map((script, index) => {
            const isRecommended = index === 0;
            const isSelected = selectedIds.includes(script.id);
            const isEditing = editingId === script.id;

            return (
              <div 
                key={script.id || index}
                className={`bg-white rounded-2xl shadow-lg transition-all duration-300 border flex flex-col overflow-hidden relative group 
                    ${isSelected 
                        ? 'border-tiktok-teal ring-2 ring-tiktok-teal shadow-2xl scale-[1.02]' 
                        : isRecommended ? 'border-tiktok-pink/30' : 'border-gray-100 hover:border-gray-300'
                    }`}
              >
                {/* Selection Overlay / Area */}
                <div className="absolute top-0 left-0 w-full h-full z-0" onClick={() => !isEditing && toggleSelection(script.id)}></div>

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
                
                <div className="p-6 flex-1 flex flex-col relative z-10 pointer-events-none">
                  <div className="mb-4 pb-4 border-b border-gray-100 pointer-events-auto">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1 block">
                      {isViralMode ? `Iteration ${index + 1}` : `Script ${index + 1}`}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">{script.framework}</h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{script.title}</p>
                  </div>

                  <div className="mb-5 pointer-events-auto">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Hook Strategy</span>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-800 italic font-medium">"{script.hookStrategy}"</p>
                    </div>
                  </div>

                  <div className="flex-1 mb-6 min-h-[200px] pointer-events-auto">
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed font-medium">{script.content}</p>
                    </div>
                  </div>

                  {/* Request Changes Section */}
                  <div className="pointer-events-auto pt-4 border-t border-gray-100">
                     {isEditing ? (
                        <div className="animate-fade-in">
                            <textarea 
                                value={editInstructions}
                                onChange={(e) => setEditInstructions(e.target.value)}
                                placeholder="Example: Make it funnier, add more urgency..."
                                className="w-full text-xs p-2 border border-gray-300 rounded-lg mb-2 focus:border-tiktok-teal outline-none bg-white text-black"
                                rows={2}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => submitChanges(script.id)}
                                    className="flex-1 bg-black text-white text-xs font-bold py-1.5 rounded-md flex items-center justify-center gap-1 hover:bg-gray-800"
                                >
                                    <Send className="w-3 h-3" /> Submit
                                </button>
                                <button 
                                    onClick={() => setEditingId(null)}
                                    className="px-3 text-xs font-bold text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                     ) : (
                         <button 
                            onClick={(e) => { e.stopPropagation(); setEditingId(script.id); }}
                            className="w-full py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-tiktok-teal transition-colors flex items-center justify-center gap-2"
                         >
                            <Edit3 className="w-3 h-3" /> Request Changes
                         </button>
                     )}
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
