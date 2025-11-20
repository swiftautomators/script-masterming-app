
import React, { useState } from 'react';
import { Lock, KeyRound, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Strict check for the password
    if (password === 'Loki2024!') {
      onLogin();
    } else {
      setError('Incorrect password');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Script<span className="text-tiktok-pink">Mastermind</span>
          </h1>
          <p className="text-gray-500 mb-8">Enter your access code to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              Access App <Sparkles className="w-4 h-4 group-hover:text-tiktok-teal transition-colors" />
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">Protected System • Authorized Access Only</p>
        </div>
      </div>
    </div>
  );
};
