import React from 'react';

export type GenerationType = 'backend' | 'frontend' | 'fullstack';

interface GenerationTypeSelectorProps {
    selectedType: GenerationType;
    onTypeChange: (type: GenerationType) => void;
}

const types: { id: GenerationType; label: string }[] = [
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'backend', label: 'Backend Only' },
    { id: 'frontend', label: 'Frontend Only' },
];

export const GenerationTypeSelector: React.FC<GenerationTypeSelectorProps> = ({ selectedType, onTypeChange }) => {
    return (
        <div className="container mx-auto px-4 pt-4">
            <div className="flex items-center justify-center bg-slate-800 rounded-lg p-1 w-full max-w-md mx-auto">
                {types.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => onTypeChange(type.id)}
                        className={`w-full text-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800
                            ${selectedType === type.id
                                ? 'bg-cyan-600 text-white shadow-sm'
                                : 'text-slate-300 hover:bg-slate-700/50'
                            }`}
                        aria-pressed={selectedType === type.id}
                    >
                        {type.label}
                    </button>
                ))}
            </div>
        </div>
    );
};