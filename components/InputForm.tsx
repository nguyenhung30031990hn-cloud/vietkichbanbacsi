
import React from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface InputFormProps {
  idea: string;
  setIdea: (idea: string) => void;
  sceneCount: number;
  setSceneCount: (count: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ idea, setIdea, sceneCount, setSceneCount, onGenerate, isLoading }) => {
  return (
    <div className="space-y-6">
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="e.g., A detective in a rainy, futuristic city discovers a conspiracy that goes all the way to the top while investigating a seemingly simple robotics malfunction."
        className="w-full h-40 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-200 placeholder-gray-500 resize-none"
        disabled={isLoading}
      />
       <div>
        <label htmlFor="scene-count" className="block text-sm font-medium text-gray-300 mb-2">
          Desired Number of Scenes:
        </label>
        <input
          id="scene-count"
          type="number"
          value={sceneCount}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setSceneCount(val > 0 ? val : 1);
          }}
          min="1"
          className="w-full max-w-xs p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-200"
          disabled={isLoading}
        />
      </div>
      <button
        onClick={onGenerate}
        disabled={isLoading || !idea.trim()}
        className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800/50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg transform hover:scale-105 active:scale-100 disabled:transform-none"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Generating...
          </>
        ) : (
          'Generate Script'
        )}
      </button>
    </div>
  );
};
