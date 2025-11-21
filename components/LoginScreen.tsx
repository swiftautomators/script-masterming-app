import React, { useState } from 'react';
import { Lock, KeyRound, Sparkles, Key } from 'lucide-react';

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
      // Check if we already have a key saved
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
    const key = apiKey.trim();
    if (key.length > 10) {
      localStorage.setItem('tiktok_mastermind_api_key', key);
      onLogin();
    } else {
      setError('Invalid API Key format');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-lg">
            {step === 'password' ? <Lock className="w-8 h-8 text-white" /> : <Key className="w-8 h-8 text-white" />}
          </div>
          
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Script<span className="text-tiktok-pink">Mastermind</span>
          </h1>
          <p className="text-gray-500 mb-8">
            {step === 'password' ? 'Enter your access code to continue.' : 'Enter your Gemini API Key to activate.'}
          </p>

          {step === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 transition-all text-black placeholder-gray-500 ${
                    error 
                      ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                      : 'border-gray-200 focus:ring-tiktok-teal/50 focus:border-tiktok-teal bg-white'
                  }`}
                  placeholder="Password"
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
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 transition-all text-black placeholder-gray-500 ${
                    error 
                      ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                      : 'border-gray-200 focus:ring-tiktok-teal/50 focus:border-tiktok-teal bg-white'
                  }`}
                  placeholder="Paste Gemini API Key"
                  autoFocus
                />
              </div>
              
              <p className="text-xs text-gray-400 text-left">
                Key is stored locally on this device. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-tiktok-teal hover:underline">Get a key here</a>.
              </p>

              {error && (
                <p className={`text-red-500 text-sm font-bold animate-pulse ${shake ? 'animate-bounce' : ''}`}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-tiktok-teal to-blue-500 text-white font-bold rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Launch System <Sparkles className="w-4 h-4 text-white" />
              </button>
              
              <button 
                type="button"
                onClick={() => setStep('password')}
                className="text-xs text-gray-400 hover:text-gray-600 mt-2"
              >
                Back to Password
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