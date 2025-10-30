import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ScriptDisplay } from './components/ScriptDisplay';
import { JsonDisplay } from './components/JsonDisplay';
import { ApiKeyManager } from './components/ApiKeyManager';
import { generateScript, generateCharacterLockJson, generateScenePromptJson, setApiKeys } from './services/geminiService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Input, 2: Script, 3: JSON
  const [idea, setIdea] = useState<string>('');
  const [sceneCount, setSceneCount] = useState<number>(30);
  const [script, setScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingAllJson, setIsGeneratingAllJson] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scenePrompts, setScenePrompts] = useState<Record<number, string>>({});
  const [characterLockJson, setCharacterLockJson] = useState<string | null>(null);

  const [isAllScriptCopied, setIsAllScriptCopied] = useState(false);
  const [isAllJsonCopied, setIsAllJsonCopied] = useState(false);
  
  const [apiKeys, setApiKeysState] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedKeys = localStorage.getItem('geminiApiKeys');
      if (savedKeys) {
        const keysArray = JSON.parse(savedKeys);
        if (Array.isArray(keysArray)) {
          setApiKeysState(keysArray);
        }
      }
    } catch (e) {
      console.error("Failed to load API keys from local storage:", e);
    }
  }, []);

  useEffect(() => {
    try {
      setApiKeys(apiKeys);
      localStorage.setItem('geminiApiKeys', JSON.stringify(apiKeys));
    } catch (e) {
      console.error("Failed to save API keys to local storage:", e);
    }
  }, [apiKeys]);

  const handleStartOver = () => {
    setCurrentStep(1);
    setIdea('');
    setScript('');
    setScenePrompts({});
    setCharacterLockJson(null);
    setError(null);
    setIsLoading(false);
    setIsGeneratingAllJson(false);
  };

  const handleGenerateScript = useCallback(async () => {
    if (apiKeys.length === 0) {
      setError('Please enter at least one Gemini API key to generate a script.');
      return;
    }
    if (!idea.trim()) {
      setError('Please enter a script idea.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setScript('');
    setScenePrompts({});
    setCharacterLockJson(null);

    try {
      const generatedScript = await generateScript(idea, sceneCount);
      setScript(generatedScript);
      setCurrentStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, [idea, sceneCount, apiKeys]);

  const getCharacterLock = useCallback(async (scriptText: string): Promise<string> => {
    if (characterLockJson) {
      return characterLockJson;
    }
    const scriptParts = scriptText.split('<END_PROFILE>');
    const profileText = scriptParts.length > 1 ? scriptParts[0].trim() : '';
    if (!profileText) throw new Error("Character profile not found in the script.");

    const newCharacterLock = await generateCharacterLockJson(profileText);
    setCharacterLockJson(newCharacterLock);
    return newCharacterLock;
  }, [characterLockJson]);

  const handleGenerateAllJson = useCallback(async () => {
    if (!script) return;
    setIsGeneratingAllJson(true);
    setError(null);
    setScenePrompts({}); // Reset prompts before starting

    const scriptParts = script.split('<END_PROFILE>');
    const sceneScript = scriptParts.length > 1 ? scriptParts[1].trim() : script;
    const scenes = sceneScript.split('---').filter(s => s.trim().length > 0);

    try {
        const lockJson = await getCharacterLock(script);
        setCurrentStep(3); // Move to step 3 to show progress
        let hasError = false;

        // Concurrently process scenes to speed up generation.
        // The number of parallel workers is based on the number of API keys
        // to distribute the load and avoid rate limits. A minimum of 2 workers
        // are used, up to a maximum of 10.
        const concurrencyLimit = Math.max(2, Math.min(apiKeys.length * 2, 10));
        const scenesIterator = scenes.entries();

        const worker = async () => {
          for (const [i, sceneText] of scenesIterator) {
            const fullSceneText = `---${sceneText.trim()}`;
            try {
                const json = await generateScenePromptJson(fullSceneText, lockJson);
                setScenePrompts(prev => ({ ...prev, [i]: json }));
            } catch (err) {
                hasError = true;
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                console.error(`Error generating JSON for scene ${i + 1}:`, err);
                setScenePrompts(prev => ({ ...prev, [i]: `// Error: ${errorMessage}` }));
            }
          }
        };

        const workers = Array(concurrencyLimit).fill(0).map(() => worker());
        await Promise.all(workers);
        
        if (hasError) {
            setError("Some scene prompts could not be generated. Please review the output.");
        }

    } catch(err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while generating JSONs.');
        setCurrentStep(2); // Go back to script view on critical error
    } finally {
        setIsGeneratingAllJson(false);
    }
  }, [script, getCharacterLock, apiKeys]);
  
  const handleCopyAllScript = useCallback(() => {
    if (!script) return;
    const scriptParts = script.split('<END_PROFILE>');
    const sceneScript = scriptParts.length > 1 ? scriptParts[1].trim() : script;
    navigator.clipboard.writeText(sceneScript);
    setIsAllScriptCopied(true);
  }, [script]);

  const handleCopyAllJson = useCallback(() => {
    const sortedKeys = Object.keys(scenePrompts).sort((a, b) => Number(a) - Number(b));
    
    const validPrompts = sortedKeys
      .map(key => scenePrompts[key as unknown as number])
      .filter(p => typeof p === 'string' && p && !p.startsWith('// Error:'));

    if (validPrompts.length === 0) return;

    try {
        const formattedLines = validPrompts.map((promptString, index) => {
            const jsonObj = JSON.parse(promptString);
            const singleLineJson = JSON.stringify(jsonObj);
            return `${index + 1}. ${singleLineJson}`;
        });

        const finalText = formattedLines.join('\n');
        navigator.clipboard.writeText(finalText);
    } catch (e) {
        console.error("Failed to parse and copy all JSON, copying as raw text.", e);
        const fallbackText = validPrompts
            .map((p, index) => `${index + 1}. ${p.replace(/\s+/g, ' ')}`)
            .join('\n');
        navigator.clipboard.writeText(fallbackText);
    }
    setIsAllJsonCopied(true);
  }, [scenePrompts]);

  useEffect(() => {
    if (isAllScriptCopied) {
      const timer = setTimeout(() => setIsAllScriptCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAllScriptCopied]);

  useEffect(() => {
    if (isAllJsonCopied) {
        const timer = setTimeout(() => setIsAllJsonCopied(false), 2000);
        return () => clearTimeout(timer);
    }
  }, [isAllJsonCopied]);

  const welcomeMessage = `Welcome to the 3-Step AI Scriptwriter!
  
Step 1: Enter your idea, choose the number of scenes, and generate your script.
Step 2: Review the full script text.
Step 3: Generate and copy all VEO JSON prompts in one click.

Please enter your Gemini API Key(s) below to begin.`;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <main>
          <ApiKeyManager apiKeys={apiKeys} setApiKeys={setApiKeysState} />

          {error && (
            <div className="my-4 text-center text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-500/30">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {currentStep === 1 && (
            <>
              <InputForm
                idea={idea}
                setIdea={setIdea}
                sceneCount={sceneCount}
                setSceneCount={setSceneCount}
                onGenerate={handleGenerateScript}
                isLoading={isLoading}
              />
              {!script && (
                 <div className="mt-8">
                  <pre className="w-full p-6 bg-gray-800/50 border border-gray-700 rounded-lg whitespace-pre-wrap font-mono text-sm sm:text-base text-gray-200 shadow-lg min-h-[300px] overflow-x-auto">
                    {welcomeMessage}
                  </pre>
                </div>
              )}
            </>
          )}

          {currentStep === 2 && (
            <ScriptDisplay 
              script={script}
              onGenerateAllJson={handleGenerateAllJson}
              isGeneratingAllJson={isGeneratingAllJson}
              onCopyAllScript={handleCopyAllScript}
              isAllScriptCopied={isAllScriptCopied}
              onStartOver={handleStartOver}
            />
          )}

          {currentStep === 3 && (
            <JsonDisplay
              scenePrompts={scenePrompts}
              onCopyAllJson={handleCopyAllJson}
              isAllJsonCopied={isAllJsonCopied}
              onBack={() => setCurrentStep(2)}
              onStartOver={handleStartOver}
              isGenerating={isGeneratingAllJson}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;