import React from 'react';

const CubeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25M12 2.25v9.75" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <CubeIcon />
      <div>
        <h1 className="text-xl font-bold text-slate-50">Full-Stack Buddy</h1>
        <p className="text-sm text-slate-400">Your AI-Powered Full-Stack Engineering Assistant</p>
      </div>
    </div>
  );
};