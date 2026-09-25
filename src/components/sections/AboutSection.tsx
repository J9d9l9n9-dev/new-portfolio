import React from 'react';
import { User, MapPin, Sparkles, BookOpen, Quote, CheckCircle2, Award, Terminal } from 'lucide-react';
import type { Profile } from '../../types';

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" aria-label="About Section" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-content mx-auto">
        {/* Section Heading with Eyebrow */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 mb-3">
            <User className="w-3.5 h-3.5" />
            <span>Professional Background</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Me</span>
          </h2>
          <p className="mt-2 text-text-secondary text-sm sm:text-base max-w-lg">
            Engineering philosophy, background, and current technical pursuits.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-3" />
        </div>

        {/* Bento Grid Layout (8px spacing, clean modern glass cards) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Card 1: Core Biography (Span 8) */}
          <div className="md:col-span-8 p-6 sm:p-8 rounded-3xl bg-bg-card border border-border shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3">
                <Terminal className="w-4 h-4" />
                <span>Engineering Philosophy</span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-text-primary mb-4 leading-snug">
                Architecting scalable web applications with clarity and pragmatic engineering.
              </h3>
              <div className="space-y-3.5 text-text-secondary text-sm sm:text-base leading-relaxed">
                <p>{profile.bio}</p>
                <p>
                  I focus heavily on test-driven development, type safety across client and server boundaries, and intuitive interfaces. Whether optimizing SQL queries or constructing fluid user interfaces with React, my benchmark is always production reliability and user empathy.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-border/50 flex flex-wrap gap-4 text-xs font-medium text-text-secondary">
              <span className="inline-flex items-center gap-1.5 text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Test-Driven Development</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Automated CI/CD Pipelines</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>WCAG 2.1 AA Accessibility</span>
              </span>
            </div>
          </div>

          {/* Card 2: Quote & Vision (Span 4) */}
          <div className="md:col-span-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-primary/10 via-bg-card to-secondary/10 border border-border shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors relative overflow-hidden">
            <Quote className="w-20 h-20 text-white/[0.04] absolute -bottom-2 -right-2 pointer-events-none" />
            <div>
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted block mb-2">
                Guiding Principle
              </span>
              <p className="font-display font-medium text-lg sm:text-xl text-text-primary italic leading-relaxed">
                "Simplicity is prerequisite for reliability. Build software that works cleanly under stress and delights humans who use it."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/50">
              <span className="text-xs font-semibold text-primary">— {profile.name}</span>
            </div>
          </div>

          {/* Card 3: Location & Time Zone (Span 4) */}
          <div className="md:col-span-4 p-6 rounded-3xl bg-bg-card border border-border shadow-sm flex flex-col justify-between hover:border-secondary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>UTC+5:30</span>
                </span>
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted block mb-1">
                Current Location
              </span>
              <h3 className="font-display font-bold text-xl text-text-primary">
                {profile.location}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
                Open to remote engineering opportunities globally and on-site roles across major tech hubs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 text-[11px] font-mono text-secondary">
              Available for Summer 2026 roles
            </div>
          </div>

          {/* Card 4: Stats Summary (Span 4) */}
          <div className="md:col-span-4 p-6 rounded-3xl bg-bg-card border border-border shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Proven Track Record</span>
            </div>
            <div className="grid grid-cols-3 gap-2 my-auto py-2">
              {profile.stats?.map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="font-display font-bold text-2xl sm:text-3xl text-primary">
                    {stat.value}+
                  </span>
                  <p className="text-[10px] sm:text-[11px] font-mono uppercase text-text-muted mt-0.5 leading-tight">
                    {stat.label.split(' ')[0]}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 text-[11px] font-mono text-text-muted flex items-center justify-between">
              <span>Code Quality</span>
              <span className="text-emerald-400 font-semibold">100% Tested</span>
            </div>
          </div>

          {/* Card 5: Currently Exploring / Learning (Span 4) */}
          <div className="md:col-span-4 p-6 rounded-3xl bg-bg-card border border-border shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted block mb-1">
                Currently Exploring
              </span>
              <h3 className="font-display font-bold text-lg text-text-primary">
                Distributed Systems & Rust
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
                Deepening knowledge in consensus algorithms (Raft), memory safety models, and high-throughput streaming pipelines.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-border text-text-muted">
                Raft
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-border text-text-muted">
                Rust
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-border text-text-muted">
                Kafka
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
