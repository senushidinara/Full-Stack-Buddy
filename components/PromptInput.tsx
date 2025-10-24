import React from 'react';
import { GenerationType } from './GenerationTypeSelector';

interface PromptInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  generationType: GenerationType;
}

const SendIcon: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
  isLoading ? (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
  )
);

const placeholders: Record<GenerationType, string> = {
    backend: "Describe your backend... e.g., 'A Node.js API for user login'",
    frontend: "Describe your frontend... e.g., 'A React login form with validation'",
    fullstack: "Describe your app... e.g., 'A blog with users, posts, and comments'",
};

export const PromptInput: React.FC<PromptInputProps> = ({ userInput, setUserInput, onSubmit, isLoading, generationType }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="container mx-auto px-4 pb-4 pt-2">
      <div className="relative">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholders[generationType]}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-16 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none transition-shadow"
          rows={1}
          disabled={isLoading}
          style={{ minHeight: '48px', maxHeight: '200px' }}
          onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
          }}
        />
        <button
          onClick={onSubmit}
          disabled={isLoading || !userInput.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold p-2 rounded-full flex items-center justify-center transition-colors"
          aria-label="Generate code"
        >
          <SendIcon isLoading={isLoading} />
        </button>
      </div>
    </div>
  );
};