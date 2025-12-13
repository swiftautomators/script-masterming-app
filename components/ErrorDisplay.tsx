import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
  onRetry: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 mx-4 rounded-r shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-red-800 font-bold mb-2 flex items-center gap-2">
            ⚠️ Generation Error
          </h3>
          <div className="text-red-700 text-sm whitespace-pre-wrap font-mono bg-red-100/50 p-3 rounded">
            {error}
          </div>
        </div>
        <button 
          onClick={onRetry}
          className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ml-4"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
