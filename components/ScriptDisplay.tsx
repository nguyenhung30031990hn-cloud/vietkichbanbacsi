import React from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { RestartIcon } from './icons/RestartIcon';

interface ScriptDisplayProps {
  script: string;
  onGenerateAllJson: () => void;
  isGeneratingAllJson: boolean;
  onCopyAllScript: () => void;
  isAllScriptCopied: boolean;
  onStartOver: () => void;
}

const PROFILE_SEPARATOR = '<END_PROFILE>';

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ 
  script, 
  onGenerateAllJson,
  isGeneratingAllJson,
  onCopyAllScript,
  isAllScriptCopied,
  onStartOver
}) => {
  const scriptParts = script.split(PROFILE_SEPARATOR);
  const profile = scriptParts.length > 1 ? scriptParts[0].trim() : null;
  const sceneScript = scriptParts.length > 1 ? scriptParts[1].trim() : script;

  return (
    <div className="mt-8">
       <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">
          <span className="text-gray-500">Step 2:</span>{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Review Your Script
          </span>
        </h2>
        <div className="flex items-center gap-2">
           <button
            onClick={onStartOver}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/70 rounded-lg text-gray-300 hover:text-white transition-all backdrop-blur-sm flex items-center justify-center text-sm"
            aria-label="Start over"
          >
            <RestartIcon />
            <span className="ml-2 hidden sm:inline">Start Over</span>
          </button>
          <button
            onClick={onCopyAllScript}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/70 rounded-lg text-gray-300 hover:text-white transition-all backdrop-blur-sm flex items-center justify-center text-sm"
            aria-label="Copy full script to clipboard"
          >
            {isAllScriptCopied ? <CheckIcon /> : <ClipboardIcon />}
            <span className="ml-2 hidden sm:inline">{isAllScriptCopied ? 'Copied Script!' : 'Copy Script'}</span>
          </button>
        </div>
      </div>
      
      {profile && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-purple-400 border-b-2 border-purple-400/30 pb-2">
            Character Profile: Dr. Strong
          </h3>
          <pre className="w-full p-6 bg-gray-800/50 border border-gray-700 rounded-lg whitespace-pre-wrap font-mono text-sm sm:text-base text-gray-200 shadow-lg overflow-x-auto max-h-96">
            {profile}
          </pre>
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-bold mb-4 text-purple-400 border-b-2 border-purple-400/30 pb-2">
          Full Script
        </h3>
        <pre className="w-full p-6 bg-gray-800/50 border border-gray-700 rounded-lg whitespace-pre-wrap font-mono text-sm sm:text-base text-gray-200 shadow-lg min-h-[300px] overflow-x-auto max-h-[60vh]">
          {sceneScript}
        </pre>
      </div>

       <div className="mt-8 border-t border-purple-500/20 pt-8 flex justify-center">
         <button
            onClick={onGenerateAllJson}
            disabled={isGeneratingAllJson}
            className="w-full max-w-sm flex items-center justify-center bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800/50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg transform hover:scale-105 active:scale-100 disabled:transform-none"
          >
            {isGeneratingAllJson ? (
              <>
                <LoadingSpinner />
                Generating VEO Prompts...
              </>
            ) : (
              <>
                <SparklesIcon />
                <span className="ml-2">Generate All JSON</span>
              </>
            )}
          </button>
      </div>
    </div>
  );
};
