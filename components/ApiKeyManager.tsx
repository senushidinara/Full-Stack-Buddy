import React, { useState, useEffect } from 'react';

interface ApiKeyManagerProps {
  apiKey: string;
  onSaveKey: (key: string) => void;
  onClearKey: () => void;
}

const EyeIcon: React.FC<{}> = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon: React.FC<{}> = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKey, onSaveKey, onClearKey }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isMasked, setIsMasked] = useState(true);

  useEffect(() => {
    if (!apiKey) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [apiKey]);

  const handleSave = () => {
    if (inputValue.trim()) {
      onSaveKey(inputValue.trim());
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setInputValue(apiKey); // Pre-fill with existing key when editing
    setIsEditing(true);
  };

  const handleCancel = () => {
    setInputValue('');
    if (apiKey) {
      setIsEditing(false);
    }
  };
  
  const handleClear = () => {
    onClearKey();
    setInputValue('');
    setIsEditing(true);
  };

  if (apiKey && !isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-400 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          API Key Set
        </span>
        <button onClick={handleEdit} className="text-xs bg-slate-600 hover:bg-slate-500 text-white font-bold py-1 px-2 rounded">Change</button>
        <button onClick={handleClear} className="text-xs bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded">Clear</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full max-w-sm">
        <div className="relative flex-grow">
            <input
                type={isMasked ? 'password' : 'text'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your API Key..."
                className="w-full bg-slate-700 border border-slate-500 rounded-md py-1 px-2 text-sm text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
            />
            <button
                onClick={() => setIsMasked(!isMasked)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                aria-label={isMasked ? 'Show API Key' : 'Hide API Key'}
            >
                {isMasked ? <EyeIcon /> : <EyeOffIcon />}
            </button>
        </div>
      <button onClick={handleSave} disabled={!inputValue.trim()} className="text-xs bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-bold py-1.5 px-3 rounded-md">Save</button>
      {apiKey && isEditing && <button onClick={handleCancel} className="text-xs bg-slate-600 hover:bg-slate-500 text-white font-bold py-1.5 px-3 rounded-md">Cancel</button>}
    </div>
  );
};