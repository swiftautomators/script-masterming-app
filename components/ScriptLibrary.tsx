
import React, { useState } from 'react';
import { SavedScript } from '../types';
import { MOCK_SAVED_SCRIPTS, LEARNING_RESOURCES, ANALYTICS_DATA } from '../services/libraryData';
import { BookOpen, BarChart2, Play, Trash2, Search, Sparkles, TrendingUp, User, Zap } from 'lucide-react';

type Tab = 'my-scripts' | 'learning' | 'analytics';

interface ScriptLibraryProps {
  onUsePattern: (script: SavedScript) => void;
  onAddViralScript: () => void;
}

export const ScriptLibrary: React.FC<ScriptLibraryProps> = ({ onUsePattern, onAddViralScript }) => {
  const [activeTab, setActiveTab] = useState<Tab>('my-scripts');
  const [savedScripts, setSavedScripts] = useState<SavedScript[]>(MOCK_SAVED_SCRIPTS);

  const handleDelete = (id: string) => {
    setSavedScripts(savedScripts.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-gray-900">My Script Library</h2>
        <p className="text-gray-500">Manage your high-performing assets and learn from the best.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-200 flex gap-1">
            <button 
                onClick={() => setActiveTab('my-scripts')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'my-scripts' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <Play className="w-4 h-4" /> My Viral Scripts
            </button>
            <button 
                onClick={() => setActiveTab('learning')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'learning' ? 'bg-tiktok-teal text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <BookOpen className="w-4 h-4" /> Learning Library
            </button>
            <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-tiktok-pink text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <BarChart2 className="w-4 h-4" /> Analytics
            </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="animate-fade-in">
        
        {/* --- MY SCRIPTS TAB --- */}
        {activeTab === 'my-scripts' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <h3 className="font-bold text-xl">Saved Scripts ({savedScripts.length})</h3>
                    <button 
                        onClick={onAddViralScript}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                        <Sparkles className="w-4 h-4" /> Add Viral Script
                    </button>
                </div>

                {savedScripts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-400">No scripts saved yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedScripts.map(script => (
                            <div key={script.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                                <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                                    {script.thumbnail ? (
                                        <img src={script.thumbnail} alt={script.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl">🎬</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                        <button className="bg-white text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold">View</button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full uppercase">{script.category}</span>
                                            <h4 className="font-bold text-lg text-gray-900 mt-1">{script.title}</h4>
                                            <p className="text-xs text-gray-500">{script.productName}</p>
                                        </div>
                                        <button onClick={() => handleDelete(script.id)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                    
                                    {script.metrics && (
                                        <div className="grid grid-cols-3 gap-2 my-4 bg-gray-50 p-2 rounded-lg">
                                            <div className="text-center">
                                                <div className="text-[10px] text-gray-400 font-bold">VIEWS</div>
                                                <div className="text-xs font-black text-gray-800">{script.metrics.views}</div>
                                            </div>
                                            <div className="text-center border-l border-gray-200">
                                                <div className="text-[10px] text-gray-400 font-bold">CTR</div>
                                                <div className="text-xs font-black text-tiktok-teal">{script.metrics.ctr}</div>
                                            </div>
                                            <div className="text-center border-l border-gray-200">
                                                <div className="text-[10px] text-gray-400 font-bold">SALES</div>
                                                <div className="text-xs font-black text-tiktok-pink">{script.metrics.sales}</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2 mt-2">
                                        <button 
                                            onClick={() => onUsePattern(script)}
                                            className="w-full py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Zap className="w-3 h-3" /> Use Pattern
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* --- LEARNING TAB --- */}
        {activeTab === 'learning' && (
            <div>
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search patterns, hooks, strategies..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-tiktok-teal bg-white text-black" />
                    </div>
                    <select className="px-4 py-3 rounded-xl border border-gray-200 bg-white font-medium text-black outline-none">
                        <option>All Categories</option>
                        <option>Hooks</option>
                        <option>Visuals</option>
                        <option>Voice</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-tiktok-pink" /> Maddie's Top Performers
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {LEARNING_RESOURCES.filter(r => r.author === 'Maddie').map(r => (
                                <div key={r.id} className="bg-pink-50 p-5 rounded-2xl border border-pink-100 hover:border-pink-300 transition-colors cursor-pointer">
                                    <h5 className="font-bold text-pink-900 mb-2">{r.title}</h5>
                                    <p className="text-sm text-pink-800/80 mb-4 line-clamp-3">{r.content}</p>
                                    <div className="flex gap-2">
                                        {r.tags.map(t => <span key={t} className="text-[10px] bg-white px-2 py-1 rounded-md font-bold text-pink-500">{t}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 mt-6">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-tiktok-teal" /> Industry Benchmarks
                        </h4>
                        <div className="space-y-4">
                            {LEARNING_RESOURCES.filter(r => r.author === 'Industry').map(r => (
                                <div key={r.id} className="bg-white p-5 rounded-2xl border border-gray-200 hover:shadow-md transition-all flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{r.category}</span>
                                        </div>
                                        <h5 className="font-bold text-gray-900">{r.title}</h5>
                                        <p className="text-sm text-gray-500 mt-1 max-w-2xl">{r.content}</p>
                                    </div>
                                    <button className="text-tiktok-teal font-bold text-sm hover:underline">Read More</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- ANALYTICS TAB --- */}
        {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-blue-500" /> Best Performing Frameworks
                    </h4>
                    <div className="space-y-4">
                        {ANALYTICS_DATA.bestFrameworks.map((f, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{f.name}</span>
                                    <span className="font-bold text-gray-900">{f.score}% Success</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className="bg-tiktok-teal h-2.5 rounded-full" style={{ width: `${f.score}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" /> Top Converting Hooks
                    </h4>
                    <ul className="space-y-3">
                        {ANALYTICS_DATA.topHooks.map((h, i) => (
                            <li key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-sm font-medium text-gray-800 italic">"{h.text}"</p>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">{h.conversion} conv.</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-2xl shadow-lg text-white col-span-1 md:col-span-2">
                     <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-xl mb-1">Voice Consistency Score</h4>
                            <p className="text-blue-100 text-sm">How well your scripts match your authentic persona.</p>
                        </div>
                        <div className="text-5xl font-black">{ANALYTICS_DATA.voiceConsistency}%</div>
                     </div>
                     <div className="w-full bg-white/20 rounded-full h-3 mt-6">
                         <div className="bg-white h-3 rounded-full" style={{ width: `${ANALYTICS_DATA.voiceConsistency}%` }}></div>
                     </div>
                     <div className="mt-4 text-sm text-blue-100 font-medium">
                        Your recent scripts are heavily aligned with the "Maddie" persona. Great job!
                     </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
