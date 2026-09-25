import React from 'react';
import { ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../ui/SocialIcons';
import { Link } from 'react-router-dom';
import type { Profile } from '../../types';

interface FooterSectionProps {
  profile: Profile;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Journey', href: '#journey' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="border-t border-border bg-bg-card/70 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-content mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Credits */}
        <div className="text-center md:text-left">
          <Link to="/" className="font-display font-bold text-text-primary text-lg tracking-tight hover:text-primary transition-colors">
            {profile.name}
          </Link>
          <p className="text-xs text-text-secondary mt-1 max-w-md leading-relaxed">
            Full-Stack Personal Portfolio: FastAPI + PostgreSQL backend with React 19 + TypeScript frontend.
          </p>
          <p className="text-[11px] text-text-muted mt-2 font-mono flex items-center justify-center md:justify-start gap-1">
            <span>© {new Date().getFullYear()} {profile.name}. Crafted with precision.</span>
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-text-secondary">
          {quickLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Socials & Back to Top */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {profile.socials?.github && (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/10 border border-border/80 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {profile.socials?.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/10 border border-border/80 transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {profile.socials?.twitter && (
              <a
                href={profile.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter Profile"
                className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/10 border border-border/80 transition-colors"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="w-[1px] h-6 bg-border" />

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-text-secondary hover:text-text-primary border border-border hover:border-primary/50 bg-bg-surface transition-all focus:outline-none"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-primary" />
          </button>
        </div>
      </div>
    </footer>
  );
};
