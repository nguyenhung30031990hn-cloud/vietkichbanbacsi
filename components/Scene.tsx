import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { SparklesIcon } from './icons/SparklesIcon';

interface SceneProps {
  sceneText: string;
  jsonPrompt?: string;
  isGeneratingJson?: boolean;
  onGenerate: () => void;
}

export const Scene: React.FC<SceneProps> = ({ sceneText, jsonPrompt, isGeneratingJson, onGenerate }) => {
  const [isSceneCopied, setIsSceneCopied] = useState(false);
  const [isJsonCopied, setIsJsonCopied] = useState(false);

  // Extract the scene title for the header, but keep it in the body
  const titleMatch = sceneText.match(/\*\*(SCENE .*?)\*\*/);
  const title = titleMatch ? titleMatch[1] : 'Scene';
  
  // The full scene text for the body, just without the leading '---' separator
  const sceneBodyText = sceneText.replace(/^---/, '').trim();

  const handleCopyScene = () => {
    navigator.clipboard.writeText(sceneText);
    setIsSceneCopied(true);
  };
  
  const handleCopyJson = () => {
    if (jsonPrompt && !jsonPrompt.startsWith('// Error:')) {
        navigator.clipboard.writeText(jsonPrompt);
        setIsJsonCopied(true);
    }
  };

  useEffect(() => {
    if (isSceneCopied) {
      const timer = setTimeout(() => setIsSceneCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSceneCopied]);
  
  useEffect(() => {
    if (isJsonCopied) {
      const timer = setTimeout(() => setIsJsonCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isJsonCopied]);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
      {/* Unified Header */}
      <div className="p-4 bg-gray-900/30 flex justify-between items-center border-b border-gray-700">
        <h3 className="font-bold text-purple-400 truncate pr-4">{title}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopyScene}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/70 rounded-lg text-gray-300 hover:text-white transition-all backdrop-blur-sm z-10 flex items-center text-xs"
            aria-label="Copy scene text to clipboard"
          >
            {isSceneCopied ? <CheckIcon /> : <ClipboardIcon />}
            <span className="ml-2 hidden sm:inline">{isSceneCopied ? 'Copied!' : 'Copy Text'}</span>
          </button>
          {jsonPrompt && !isGeneratingJson && !jsonPrompt.startsWith('// Error:') && (
             <button
                onClick={handleCopyJson}
                className="p-2 bg-gray-700/50 hover:bg-gray-600/70 rounded-lg text-gray-300 hover:text-white transition-all backdrop-blur-sm z-10 flex items-center text-xs"
                aria-label="Copy JSON prompt to clipboard"
              >
                {isJsonCopied ? <CheckIcon /> : <ClipboardIcon />}
                <span className="ml-2 hidden sm:inline">{isJsonCopied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
          )}
        </div>
      </div>
      
      {/* Unified Content Area */}
      <div className="p-6">
        {/* Original Scene Text */}
        <pre className="w-full whitespace-pre-wrap font-mono text-sm text-gray-200 overflow-x-auto">
          {sceneBodyText}
        </pre>
        
        <hr className="my-6 border-t border-purple-500/30" />

        {/* Generated JSON Prompt */}
        <div>
            <h4 className="font-semibold text-teal-400 mb-4">VEO Prompt (JSON)</h4>
            <div className="w-full p-4 bg-black/20 rounded-md min-h-[10rem] flex items-center justify-center">
                {isGeneratingJson && (
                    <div className="flex flex-col items-center text-gray-400">
                        <LoadingSpinner />
                        <span className="mt-2 text-sm">Generating VEO Prompt...</span>
                    </div>
                )}
                {jsonPrompt && !isGeneratingJson && (
                    <pre className={`w-full whitespace-pre-wrap font-mono text-xs ${jsonPrompt.startsWith('// Error:') ? 'text-red-400' : 'text-teal-200'} overflow-x-auto`}>
                        <code>{jsonPrompt}</code>
                    </pre>
                )}
                {!jsonPrompt && !isGeneratingJson && (
                    <button 
                      onClick={onGenerate}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center"
                    >
                      <SparklesIcon />
                      <span className="ml-2">Generate VEO Prompt</span>
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
