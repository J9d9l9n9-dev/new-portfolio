import React, { useState } from 'react';
import { Briefcase, GraduationCap, Calendar, CheckCircle2, Building, BookOpen } from 'lucide-react';
import type { Experience, Education } from '../../types';

interface ExperienceSectionProps {
  experience: Experience[];
  education: Education[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience, education }) => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

  return (
    <section id="experience" aria-label="Experience and Education Timeline" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-content mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career Milestones</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary tracking-tight">
            Experience & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Education</span>
          </h2>
          <p className="mt-2 text-text-secondary text-sm sm:text-base max-w-lg">
            Engineering internships, academic history, and proven responsibilities.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-3" />

          {/* Tab Switcher */}
          <div className="mt-8 inline-flex p-1 rounded-2xl bg-bg-card border border-border shadow-sm">
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'experience'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Project Experience</span>
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'education'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Academic Education</span>
            </button>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="max-w-3xl mx-auto relative pl-6 sm:pl-8 border-l-2 border-border/80 space-y-8">
          {activeTab === 'experience' &&
            experience.map((item, idx) => (
              <div key={item.company + idx} className="relative group">
                {/* Node dot on timeline */}
                <div className="absolute -left-[33px] sm:-left-[41px] top-1.5 w-4 h-4 rounded-full bg-bg border-2 border-primary group-hover:bg-primary transition-colors shadow-sm" />

                <div className="p-6 sm:p-7 rounded-3xl bg-bg-card border border-border shadow-sm hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-text-primary">
                      {item.title}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-secondary bg-secondary/10 border border-secondary/20">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.period}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-4">
                    <Building className="w-4 h-4 text-text-muted" />
                    <span>{item.company}</span>
                  </div>

                  <ul className="space-y-2.5 text-sm text-text-secondary">
                    {item.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

          {activeTab === 'education' &&
            education.map((item, idx) => (
              <div key={item.school + idx} className="relative group">
                {/* Node dot on timeline */}
                <div className="absolute -left-[33px] sm:-left-[41px] top-1.5 w-4 h-4 rounded-full bg-bg border-2 border-secondary group-hover:bg-secondary transition-colors shadow-sm" />

                <div className="p-6 sm:p-7 rounded-3xl bg-bg-card border border-border shadow-sm hover:border-secondary/40 transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-text-primary">
                      {item.degree}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-secondary bg-secondary/10 border border-secondary/20">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.period}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                    <BookOpen className="w-4 h-4 text-secondary" />
                    <span>{item.school}</span>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.degree.toLowerCase().includes('mpc') || item.degree.toLowerCase().includes('intermediate')
                      ? 'Core coursework in Advanced Mathematics (Calculus, Algebra, Analytical Geometry), Physics (Mechanics, Electromagnetism, Modern Physics), and Chemistry (Organic, Physical, Inorganic) with outstanding academic performance (93.9%).'
                      : 'Comprehensive computer science curriculum covering Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks, and Web Application Engineering.'}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
