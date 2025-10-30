import React from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { RestartIcon } from './icons/RestartIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';


interface JsonDisplayProps {
  scenePrompts: Record<number, string>;
  onCopyAllJson: () => void;
  isAllJsonCopied: boolean;
  onBack: () => void;
  onStartOver: () => void;
  isGenerating?: boolean;
}

export const JsonDisplay: React.FC<JsonDisplayProps> = ({
  scenePrompts,
  onCopyAllJson,
  isAllJsonCopied,
  onBack,
  onStartOver,
  isGenerating,
}) => {
  const sortedKeys = Object.keys(scenePrompts).sort((a, b) => Number(a) - Number(b));
  const hasPrompts = sortedKeys.length > 0;

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">
          <span className="text-gray-500">Step 3:</span>{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
            Copy VEO Prompts
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/70 rounded-lg text-gray-300 hover:text-white transition-all backdrop-blur-sm flex items-center justify-center text-sm"
            aria-label="Back to script"
          >
            <ArrowLeftIcon />
            <span className="ml-2 hidden sm:inline">Back to Script</span>
          </button>
           <button
            onClick={onStartOver}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/70 rounded-lg text-gray-300 hover:text-white transition-all backdrop-blur-sm flex items-center justify-center text-sm"
            aria-label="Start over"
          >
            <RestartIcon />
            <span className="ml-2 hidden sm:inline">Start Over</span>
          </button>
          <button
            onClick={onCopyAllJson}
            disabled={!hasPrompts || isGenerating}
            className="p-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800/50 disabled:cursor-not-allowed rounded-lg text-white transition-all backdrop-blur-sm flex items-center justify-center text-sm font-semibold"
            aria-label="Copy all JSON prompts"
          >
            {isAllJsonCopied ? <CheckIcon /> : <ClipboardIcon />}
            <span className="ml-2 hidden sm:inline">{isAllJsonCopied ? 'Copied!' : 'Copy All JSON'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {sortedKeys.map((key) => {
          const index = Number(key);
          const prompt = scenePrompts[index];
          const isError = prompt.startsWith('// Error:');
          return (
            <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
              <pre className={`w-full p-4 whitespace-pre-wrap font-mono text-xs overflow-x-auto ${isError ? 'text-red-400' : 'text-teal-200'}`}>
                <code>{prompt}</code>
              </pre>
            </div>
          );
        })}

        {isGenerating && (
           <div className="bg-gray-800/50 border border-dashed border-gray-600 rounded-lg shadow-lg p-8 flex flex-col items-center justify-center text-gray-400">
              <LoadingSpinner />
              <p className="mt-4 text-center">Generating VEO Prompts...</p>
              <p className="text-sm text-gray-500">Please wait, scenes will appear above as they are completed.</p>
            </div>
        )}
      </div>
    </div>
  );
};