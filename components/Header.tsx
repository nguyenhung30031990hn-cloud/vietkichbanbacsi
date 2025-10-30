
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          AI Scriptwriter Pro
        </span>
      </h1>
      <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
        Transform your concepts into cinema-ready screenplays with the power of AI.
      </p>
    </header>
  );
};
