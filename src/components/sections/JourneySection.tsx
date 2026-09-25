import React from 'react';
import { Milestone, Sparkles } from 'lucide-react';
import type { JourneyMilestone } from '../../types';

interface JourneySectionProps {
  milestones: JourneyMilestone[];
}

export const JourneySection: React.FC<JourneySectionProps> = ({ milestones }) => {
  if (!milestones || milestones.length === 0) return null;

  return (
    <section id="journey" className="py-20 px-4 sm:px-6 lg:px-8 max-w-content mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-semibold uppercase tracking-wider mb-4">
          <Milestone className="w-3.5 h-3.5" />
          <span>My Learning Journey</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-text-primary">
          From First Code to <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Production Systems</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-text-secondary leading-relaxed">
          A milestone timeline tracing how curiosity evolved into engineering discipline through projects, hackathons, and systems architectures.
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative max-w-3xl mx-auto">
        {/* Continuous gradient spine */}
        <div 
          className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary via-secondary to-accent/20" 
          aria-hidden="true" 
        />

        <div className="space-y-10 sm:space-y-12">
          {milestones.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={item.id || item.year + index}
                className={`relative flex flex-col sm:flex-row items-start ${
                  isEven ? 'sm:flex-row-reverse' : ''
                } gap-6 sm:gap-12 group`}
              >
                {/* Center Timeline Node */}
                <div 
                  className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface border-2 border-primary group-hover:border-secondary flex items-center justify-center shadow-md transition-colors z-10"
                  aria-hidden="true"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                </div>

                {/* Content Card */}
                <div className={`w-full sm:w-[calc(50%-2rem)] pl-12 sm:pl-0 ${isEven ? 'sm:text-right' : 'sm:text-left'}`}>
                  <div className="glass-card p-6 rounded-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 shadow-sm">
                    {/* Year & Tag */}
                    <div className={`flex items-center gap-2 mb-2 flex-wrap ${isEven ? 'sm:justify-end' : 'sm:justify-start'}`}>
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                        {item.year}
                      </span>
                      {item.tag && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-secondary/10 text-secondary border border-secondary/20">
                          <Sparkles className="w-3 h-3" />
                          <span>{item.tag}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-display font-bold text-text-primary tracking-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
