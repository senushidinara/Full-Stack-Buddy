import React from 'react';

interface ComingSoonViewProps {
    title: string;
    description: string;
    // FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    icon: React.ReactElement;
}

export const ComingSoonView: React.FC<ComingSoonViewProps> = ({ title, description, icon }) => {
    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-400 p-8">
            <div className="w-16 h-16 text-slate-600 mb-4">
                {icon}
            </div>
            <h2 className="text-2xl font-semibold text-slate-300 mb-2">{title}</h2>
            <p className="max-w-md">{description}</p>
        </div>
    );
};
