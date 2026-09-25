import React from 'react';
import { Cpu, Code2, Layers, Server, Terminal, Sparkles, BookOpen, Database } from 'lucide-react';
import { TechLogo } from '../ui/TechLogos';
import type { SkillCategory, LearningItem } from '../../types';

interface SkillsSectionProps {
  skills: SkillCategory[];
  learningItems?: LearningItem[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, learningItems }) => {
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('program') || cat.includes('language')) return <Code2 className="w-5 h-5 text-primary" />;
    if (cat.includes('front')) return <Layers className="w-5 h-5 text-secondary" />;
    if (cat.includes('back')) return <Server className="w-5 h-5 text-emerald-400" />;
    if (cat.includes('data')) return <Database className="w-5 h-5 text-cyan-400" />;
    if (cat.includes('ai') || cat.includes('ml')) return <Cpu className="w-5 h-5 text-purple-400" />;
    if (cat.includes('fundamental') || cat.includes('core')) return <BookOpen className="w-5 h-5 text-amber-400" />;
    if (cat.includes('tool') || cat.includes('devops')) return <Terminal className="w-5 h-5 text-rose-400" />;
    return <Cpu className="w-5 h-5 text-primary" />;
  };

  const getProficiency = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('program') || cat.includes('language')) return { label: 'Intermediate - Advanced', percent: 85 };
    if (cat.includes('front')) return { label: 'Intermediate', percent: 82 };
    if (cat.includes('back')) return { label: 'Intermediate', percent: 80 };
    if (cat.includes('data')) return { label: 'Intermediate', percent: 80 };
    if (cat.includes('ai') || cat.includes('ml')) return { label: 'Foundational - Intermediate', percent: 75 };
    return null;
  };

  return (
    <section id="skills" aria-label="Technical Skills Section" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-content mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-secondary bg-secondary/10 border border-secondary/20 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary tracking-tight">
            Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Tooling</span>
          </h2>
          <p className="mt-2 text-text-secondary text-sm sm:text-base max-w-lg">
            Organized by domain with real tech logo chips and honest proficiency indicators.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-secondary to-primary rounded-full mt-3" />
        </div>

        {/* Grouped Skills Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skills.map((category) => {
            const isChipsOnly = category.category.toLowerCase().includes('fundamental') || 
                                category.category.toLowerCase().includes('tool') ||
                                (category.chips && category.chips.length > 0 && (!category.items || category.items.length === 0));

            const itemsList = category.items && category.items.length > 0
              ? category.items
              : (category.chips || []);

            const prof = getProficiency(category.category);

            return (
              <div
                key={category.category}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 shadow-sm"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-xl bg-white/5 border border-border">
                      {getCategoryIcon(category.category)}
                    </div>
                    <h3 className="font-display font-bold text-base text-text-primary">
                      {category.category}
                    </h3>
                  </div>

                  {/* Skills Logo Chips */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {itemsList.map((skill, idx) => {
                      const skillName = typeof skill === 'string' ? skill : skill.name;
                      const skillLevel = typeof skill === 'object' ? skill.level : undefined;
                      return (
                        <div
                          key={skillName + idx}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-surface border border-border/80 text-xs font-medium text-text-primary hover:border-primary/50 hover:bg-white/5 transition-all cursor-default"
                        >
                          <TechLogo name={skillName} className="w-3.5 h-3.5" />
                          <span>{skillName}</span>
                          {!isChipsOnly && skillLevel && (
                            <span className="text-[10px] font-mono text-text-muted px-1.5 py-0.5 rounded bg-white/5 border border-border/40">
                              {skillLevel}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Clean Proficiency Bar & Indicator (only for categories with levels) */}
                {prof && !isChipsOnly && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-text-muted">{prof.label}</span>
                      <span className="text-primary font-semibold">{prof.percent}%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                        style={{ width: `${prof.percent}%` }}
                      />
                    </div>
                  </div>
                )}
                {isChipsOnly && (
                  <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs font-mono text-text-muted">
                    <span>{category.category.toLowerCase().includes('fundamental') ? 'Academic CS' : 'Developer Toolchain'}</span>
                    <span className="text-[11px] text-text-muted/80">Foundational</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Currently Learning Chips Row */}
        {learningItems && learningItems.length > 0 && (
          <div className="mt-10 glass-card p-6 rounded-2xl border border-secondary/20 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">
                  Currently Exploring & Deep Diving
                </h3>
              </div>
              <span className="text-xs font-mono text-text-muted">Self-Directed Learning Goals</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {learningItems.map((item) => (
                <div
                  key={item.id || item.name}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-bg-surface border border-secondary/30 text-xs font-mono text-text-primary hover:border-secondary transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  <span className="font-semibold">{item.name}</span>
                  {item.status && (
                    <span className="text-[10px] text-text-muted px-1.5 py-0.5 rounded bg-white/5 border border-border">
                      {item.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
