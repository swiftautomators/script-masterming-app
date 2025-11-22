import React from 'react';

interface LoadingStateProps {
  message: string;
  subMessage?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message, subMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-tiktok-teal border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-tiktok-pink border-b-transparent animate-spin direction-reverse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2 animate-pulse">{message}</h3>
      {subMessage && (
        <p className="text-gray-500 max-w-sm mx-auto">{subMessage}</p>
      )}
    </div>
  );
};