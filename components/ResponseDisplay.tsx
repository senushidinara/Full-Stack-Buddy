import React, { useState, useEffect, useMemo } from 'react';
import JSZip from 'jszip';
import { Loader } from './Loader';
import { Solution } from '../services/geminiService';

interface ResponseDisplayProps {
  response: Solution | null;
  isLoading: boolean;
  error: string;
}

type Tab = 'overview' | 'backend' | 'frontend' | 'preview' | 'instructions';

const tabLabels: Record<Tab, string> = {
  overview: 'Overview',
  backend: 'Backend',
  frontend: 'Frontend',
  preview: 'Live Preview',
  instructions: 'Instructions',
};

type ExtractedFile = { path: string; code: string; language: string };

const extractFilesFromMarkdown = (markdown: string): ExtractedFile[] => {
    if (!markdown) return [];
    const files: ExtractedFile[] = [];
    const regex = /```(\w*):([\w.\/]+)\n([\s\S]*?)\n```/g;
    let match;
    while ((match = regex.exec(markdown)) !== null) {
        files.push({
            language: match[1] || '',
            path: match[2],
            code: match[3].trim(),
        });
    }
    return files;
};

const WelcomeMessage: React.FC = () => (
    <div className="text-center text-slate-400 flex flex-col items-center justify-center h-full gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h2 className="text-2xl font-semibold text-slate-300">Welcome to Full-Stack Buddy</h2>
        <p className="max-w-md">
            Select a generation type, describe your application needs below, and get a complete, integrated solution with a live preview and downloadable ZIP.
        </p>
    </div>
);

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const regex = /(```\w*:[\w.\/]+\n[\s\S]*?\n```)/g;
    const parts = content.split(regex);
    
    return (
        <>
            {parts.map((part, index) => {
                if (part.match(regex)) {
                    const fileMatch = part.match(/```(\w*):([\w.\/]+)\n/);
                    const lang = fileMatch?.[1] || '';
                    const path = fileMatch?.[2] || '';
                    const code = part.replace(/```.*\n/, '').replace(/\n```$/, '');
                    return (
                        <div key={index} className="bg-slate-950 rounded-md my-4 relative group border border-slate-700">
                             <div className="flex items-center justify-between bg-slate-800 px-3 py-1 border-b border-slate-700">
                                <span className="text-xs text-slate-400 font-mono">{path}</span>
                                <span className="text-xs text-slate-500 font-mono">{lang}</span>
                            </div>
                             <button
                                onClick={() => navigator.clipboard.writeText(code)}
                                className="absolute top-1 right-2 text-xs text-slate-400 bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                Copy
                            </button>
                            <pre className="p-4 overflow-x-auto text-sm text-slate-300">
                                <code>{code.trim()}</code>
                            </pre>
                        </div>
                    );
                }
                const lines = part.trim().split('\n').filter(line => line.trim() !== '');
                return (
                    <div key={index} className="prose prose-invert prose-sm md:prose-base max-w-none">
                        {lines.map((line, lineIndex) => {
                            if (line.startsWith('# ')) return <h1 key={lineIndex} className="text-3xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
                            if (line.startsWith('## ')) return <h2 key={lineIndex} className="text-2xl font-bold mt-4 mb-2 border-b border-slate-700 pb-1">{line.substring(3)}</h2>;
                            if (line.startsWith('### ')) return <h3 key={lineIndex} className="text-xl font-bold mt-4 mb-2">{line.substring(4)}</h3>;
                            if (line.startsWith('* ') || line.startsWith('- ')) return <li key={lineIndex}>{line.substring(2)}</li>;
                            return <p key={lineIndex} dangerouslySetInnerHTML={{ __html: line.replace(/`([^`]+)`/g, '<code class="bg-slate-700 text-cyan-400 rounded px-1 py-0.5 text-sm font-mono">$1</code>') }}></p>;
                        })}
                    </div>
                );
            })}
        </>
    );
};


export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, isLoading, error }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const availableTabs = useMemo(() => {
        const tabs: Tab[] = [];
        if (!response) return tabs;
        if (response.overview) tabs.push('overview');
        if (response.backend) tabs.push('backend');
        if (response.frontend) {
            tabs.push('frontend');
            tabs.push('preview');
        }
        if (response.instructions) tabs.push('instructions');
        return tabs;
    }, [response]);

    useEffect(() => {
        if (response && availableTabs.length > 0) {
            setActiveTab(availableTabs[0]);
        }
    }, [response, availableTabs]);
    
    const handleDownloadZip = async () => {
        if (!response) return;

        const zip = new JSZip();

        if (response.overview) {
            zip.file("README.md", response.overview);
        }
         if (response.instructions) {
            zip.file("INSTRUCTIONS.md", response.instructions);
        }
        const backendFiles = extractFilesFromMarkdown(response.backend || '');
        backendFiles.forEach(file => zip.file(file.path, file.code));

        const frontendFiles = extractFilesFromMarkdown(response.frontend || '');
        frontendFiles.forEach(file => zip.file(file.path, file.code));

        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "full-stack-buddy-app.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) return <Loader />;

    if (error) {
        return (
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md max-w-md text-center">
                    <strong className="font-bold">An error occurred:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            </div>
        );
    }

    if (!response) {
        return (
            <div className="flex-grow flex items-center justify-center p-4">
                <WelcomeMessage />
            </div>
        );
    }

    const contentToRender = response[activeTab as keyof Solution] || '';

    return (
        <div className="flex-grow bg-slate-800/50 border border-slate-700 rounded-lg flex flex-col w-full mb-6">
            <div className="border-b border-slate-700 px-4 flex justify-between items-center">
                {availableTabs.length > 0 && (
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        {availableTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${
                                    activeTab === tab
                                        ? 'border-cyan-500 text-cyan-400'
                                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize transition-colors`}
                            >
                                {tabLabels[tab]}
                            </button>
                        ))}
                    </nav>
                )}
                 <button onClick={handleDownloadZip} className="flex items-center gap-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-1.5 px-3 rounded-md transition-colors my-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download ZIP
                </button>
            </div>
            <div className="overflow-y-auto flex-grow relative">
                {activeTab === 'preview' ? (
                     <div className="w-full h-full flex items-center justify-center bg-slate-900 p-4 absolute">
                        <div className="relative w-full h-full rounded-md overflow-hidden border border-slate-700 bg-slate-950">
                            {response?.previewImage ? (
                                <img
                                    src={response.previewImage}
                                    alt="AI-generated UI Preview"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-center text-slate-400 p-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-slate-300">Preview Not Available</h3>
                                    <p className="text-sm">An image preview could not be generated for this request.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-6 whitespace-pre-wrap font-sans text-slate-300">
                        <MarkdownRenderer content={contentToRender} />
                    </div>
                )}
            </div>
        </div>
    );
};