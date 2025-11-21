
import React, { useState, useEffect } from 'react';
import { Lock, Sparkles, Key, ChevronRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'password' | 'apikey'>('password');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Loki2024!') {
      // Check if we already have an API key
      const storedKey = localStorage.getItem('tiktok_mastermind_api_key');
      if (storedKey) {
        onLogin();
      } else {
        setStep('apikey');
        setError('');
      }
    } else {
      setError('Incorrect password');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim().length > 10) {
      localStorage.setItem('tiktok_mastermind_api_key', apiKey.trim());
      onLogin();
    } else {
      setError('Please enter a valid API Key');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-lg transition-all duration-500">
            {step === 'password' ? (
                <Lock className="w-8 h-8 text-white" />
            ) : (
                <Key className="w-8 h-8 text-tiktok-teal" />
            )}
          </div>
          
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Script<span className="text-tiktok-pink">Mastermind</span>
          </h1>
          <p className="text-gray-500 mb-8">
            {step === 'password' ? 'Enter your access code to continue.' : 'Configure your AI access.'}
          </p>

          {step === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-fade-in">
                <div className="relative">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                    }}
                    className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 transition-all text-black placeholder-gray-500 text-center font-bold tracking-widest ${
                    error 
                        ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                        : 'border-gray-200 focus:ring-tiktok-teal/50 focus:border-tiktok-teal bg-white'
                    }`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    autoFocus
                />
                </div>

                {error && (
                <p className={`text-red-500 text-sm font-bold animate-pulse ${shake ? 'animate-bounce' : ''}`}>
                    {error}
                </p>
                )}

                <button
                type="submit"
                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                Verify Access <Sparkles className="w-4 h-4 group-hover:text-tiktok-teal transition-colors" />
                </button>
            </form>
          ) : (
            <form onSubmit={handleApiKeySubmit} className="space-y-4 animate-fade-in">
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Google Gemini API Key</label>
                  <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => {
                      setApiKey(e.target.value);
                      setError('');
                      }}
                      className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 transition-all text-black placeholder-gray-500 text-center font-mono text-sm ${
                      error 
                          ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                          : 'border-gray-200 focus:ring-tiktok-pink/50 focus:border-tiktok-pink bg-white'
                      }`}
                      placeholder="AIzaSy..."
                      autoComplete="off"
                      autoFocus
                  />
                  <p className="text-[10px] text-gray-400 mt-2">Key is stored locally on this device.</p>
                </div>

                {error && (
                <p className={`text-red-500 text-sm font-bold animate-pulse ${shake ? 'animate-bounce' : ''}`}>
                    {error}
                </p>
                )}

                <button
                type="submit"
                className="w-full py-3 bg-tiktok-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                Save & Connect <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
          )}
        </div>
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">Protected System • Authorized Access Only</p>
        </div>
      </div>
    </div>
  );
};
