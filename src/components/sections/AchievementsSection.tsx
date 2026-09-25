import React from 'react';
import { Trophy, ExternalLink, Flame } from 'lucide-react';
import type { Achievement } from '../../types';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  if (!achievements || achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-20 px-4 sm:px-6 lg:px-8 max-w-content mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4">
          <Trophy className="w-3.5 h-3.5" />
          <span>Achievements & Competitive Track Record</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-text-primary">
          Hackathons & <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">Competitive Coding</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-text-secondary leading-relaxed">
          Demonstrated problem-solving under pressure in 24-36 hour hackathon sprints and algorithmic programming contests.
        </p>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievements.map((item) => (
          <div
            key={item.id || item.title}
            className="glass-card p-6 rounded-2xl flex flex-col justify-between hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 shadow-sm group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{item.badge || 'Award'}</span>
                </span>
                <span className="font-mono text-xs text-text-muted">
                  {item.date}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-text-primary group-hover:text-primary transition-colors tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs font-semibold text-text-secondary mt-1">
                {item.organization}
              </p>
              <p className="text-xs text-text-muted mt-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            {item.url && (
              <div className="mt-6 pt-4 border-t border-border flex justify-end">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
