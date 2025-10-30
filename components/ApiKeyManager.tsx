import React from 'react';

interface ApiKeyManagerProps {
  apiKeys: string[];
  setApiKeys: (keys: string[]) => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKeys, setApiKeys }) => {
  
  const handleKeysChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const keysString = event.target.value;
    const keysArray = keysString.split('\n').map(k => k.trim()).filter(Boolean);
    setApiKeys(keysArray);
  };

  const keysForDisplay = apiKeys.join('\n');

  return (
    <div className="my-8 p-6 bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-purple-400">
          Gemini API Keys
        </h2>
        <p className="text-gray-400 mb-4 text-sm">
          To avoid rate limits, enter your Gemini API keys below, one per line. The app will rotate through them for each request. Your keys are saved in your browser's local storage and are not sent anywhere else.
        </p>
        <textarea
            value={keysForDisplay}
            onChange={handleKeysChange}
            placeholder="Enter one Google AI Studio API key per line..."
            className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-200 placeholder-gray-500 resize-y font-mono text-sm"
            spellCheck="false"
            aria-label="Gemini API Keys Input"
        />
        <p className="text-gray-500 mt-2 text-xs">
          {apiKeys.length} key(s) loaded. Keys are saved automatically as you type.
        </p>
    </div>
  );
};
