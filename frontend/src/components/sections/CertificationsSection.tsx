import React from 'react';
import { Award, ExternalLink, CheckCircle2 } from 'lucide-react';
import type { Certification } from '../../types';

interface CertificationsSectionProps {
  certifications: Certification[];
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications }) => {
  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8 max-w-content mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-semibold uppercase tracking-wider mb-4">
          <Award className="w-3.5 h-3.5" />
          <span>Certifications & Credentials</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-text-primary">
          Verified <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Domain Mastery</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-text-secondary leading-relaxed">
          Industry-recognized certifications and specialized coursework demonstrating expertise in cloud infrastructure, databases, and deep learning.
        </p>
      </div>

      {/* Grid of Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div
            key={cert.id || cert.title}
            className="glass-card p-6 rounded-2xl flex flex-col justify-between hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-sm group"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary/10 to-secondary/10 border border-border flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-white/5 border border-border text-text-muted">
                  {cert.date}
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-text-primary group-hover:text-primary transition-colors leading-snug">
                {cert.title}
              </h3>
              <p className="text-xs font-medium text-text-secondary mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                <span>{cert.issuer}</span>
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Verified Active
              </span>
              {cert.credential_url ? (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-xs text-text-muted">Academic Record</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
