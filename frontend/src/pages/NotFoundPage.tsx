import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Terminal } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-glow-primary">
        <Terminal className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-secondary mb-2">
        Error 404 • Resource Not Found
      </span>
      <h1 className="font-display font-bold text-4xl sm:text-5xl text-text-primary mb-4">
        Page Not Located
      </h1>
      <p className="text-text-secondary text-sm sm:text-base max-w-md mb-8 leading-relaxed">
        The route you are navigating to does not exist or has been restructured in the application routing hierarchy.
      </p>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-primary hover:bg-primary-light transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary bg-bg-card border border-border transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};
