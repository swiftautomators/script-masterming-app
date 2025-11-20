
import React from 'react';
import { CompetitorAnalysis } from '../types';
import { ArrowLeft, ShieldAlert, Trophy, Target, Lightbulb, ScrollText, Star } from 'lucide-react';

interface CompetitorAnalysisDisplayProps {
  analysis: CompetitorAnalysis;
  onBack: () => void;
}

export const CompetitorAnalysisDisplay: React.FC<CompetitorAnalysisDisplayProps> = ({ analysis, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-tiktok-black transition-colors mb-4 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </button>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900">Competitor Deep Dive</h2>
            <p className="text-gray-500 font-medium">Analysis of: <span className="text-indigo-600 font-bold">{analysis.competitorName}</span></p>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-2xl shadow-sm border-l-4 border-indigo-500 p-6 mb-8">
        <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-indigo-500" /> Performance Overview
        </h3>
        <p className="text-gray-700 leading-relaxed">{analysis.performanceOverview}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Successful Patterns */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" /> Winning Patterns
          </h3>
          <div className="space-y-4">
            {analysis.successfulPatterns.map((pattern, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="font-bold text-gray-800 text-sm mb-1">{pattern.patternName}</h4>
                <p className="text-xs text-gray-500 mb-2 italic">"{pattern.example}"</p>
                <div className="text-xs text-indigo-600 font-semibold bg-indigo-50 inline-block px-2 py-1 rounded">
                  Why it works: {pattern.whyItWorks}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities & Gaps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" /> The "Maddie" Advantage
          </h3>
          
          <div className="mb-6">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Gaps & Weaknesses</h4>
             <ul className="space-y-2">
               {analysis.opportunities.map((opp, i) => (
                 <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                   <span className="text-red-500 font-bold mt-1">✕</span> {opp}
                 </li>
               ))}
             </ul>
          </div>

          <div>
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Differentiation Strategy</h4>
             <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-sm text-green-800 font-medium leading-relaxed">
                  {analysis.differentiationStrategy}
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Better Script */}
      <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-tiktok-teal" /> 
            The Superior Script (Maddie's Version)
          </h3>
          <span className="text-xs font-bold bg-tiktok-teal text-gray-900 px-2 py-1 rounded">READY TO FILM</span>
        </div>
        <div className="p-8">
          <pre className="whitespace-pre-wrap font-sans text-gray-300 text-lg leading-relaxed pl-4 border-l-4 border-tiktok-pink">
            {analysis.sampleScript}
          </pre>
        </div>
      </div>
    </div>
  );
};
