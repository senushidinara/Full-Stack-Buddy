import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { ResponseDisplay } from './components/ResponseDisplay';
import { GenerationTypeSelector, GenerationType } from './components/GenerationTypeSelector';
import { generateSolution, Solution } from './services/geminiService';
import { FunctionTabs, FunctionType } from './components/FunctionTabs';
import { ComingSoonView } from './components/ComingSoonView';

// Icons for ComingSoonView
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const BeakerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

// FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const comingSoonFeatures: Record<Exclude<FunctionType, 'generate'>, { title: string; description: string; icon: React.ReactElement }> = {
    refactor: { title: "Refactor Code", description: "Submit a piece of code and get a refactored, optimized, and more readable version.", icon: <SparklesIcon/> },
    explain: { title: "Explain Code", description: "Don't understand a block of code? Paste it here to get a detailed, line-by-line explanation of what it does.", icon: <BookOpenIcon/> },
    test: { title: "Write Unit Tests", description: "Automatically generate unit tests for your code to ensure its reliability and robustness.", icon: <BeakerIcon/> },
    docs: { title: "Generate Docs", description: "Create professional, clean documentation for your functions, classes, or entire files.", icon: <DocumentTextIcon/> },
};

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [generationType, setGenerationType] = useState<GenerationType>('fullstack');
  const [apiResponse, setApiResponse] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeFunction, setActiveFunction] = useState<FunctionType>('generate');

  // FIX: Removed API key management from UI. API key is now handled by process.env.API_KEY in geminiService.
  const handleGenerate = useCallback(async () => {
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setApiResponse(null);

    try {
      const response = await generateSolution(userInput, generationType);
      setApiResponse(response);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isLoading, generationType]);

  const handleTabChange = (tab: FunctionType) => {
    setActiveFunction(tab);
    setApiResponse(null);
    setError('');
    setUserInput('');
    setIsLoading(false);
  }

  const renderMainContent = () => {
      if (activeFunction === 'generate') {
          return <ResponseDisplay response={apiResponse} isLoading={isLoading} error={error} />;
      }
      const feature = comingSoonFeatures[activeFunction as Exclude<FunctionType, 'generate'>];
      return <ComingSoonView title={feature.title} description={feature.description} icon={feature.icon} />;
  }
  
  const renderFooterContent = () => {
      if (activeFunction === 'generate') {
          return (
            <>
              <GenerationTypeSelector selectedType={generationType} onTypeChange={setGenerationType} />
              <PromptInput
                  userInput={userInput}
                  setUserInput={setUserInput}
                  onSubmit={handleGenerate}
                  isLoading={isLoading}
                  generationType={generationType}
              />
            </>
          );
      }
      return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col font-sans">
      <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <Header />
          {/* FIX: Removed ApiKeyManager from UI to adhere to project guidelines. */}
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col w-full overflow-hidden">
        <FunctionTabs activeTab={activeFunction} onTabChange={handleTabChange} />
        <div className="flex-grow flex flex-col mt-6 overflow-y-auto">
            {renderMainContent()}
        </div>
      </main>
      <div className="sticky bottom-0 bg-slate-900/50 backdrop-blur-lg border-t border-slate-700/50 w-full">
         {renderFooterContent()}
      </div>
    </div>
  );
};

export default App;
