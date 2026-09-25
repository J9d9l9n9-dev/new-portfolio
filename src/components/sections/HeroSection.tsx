import React, { useState, useEffect, useRef } from 'react';
import { Eye, FileText, MapPin, Sparkles, ChevronDown, Code, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../ui/SocialIcons';
import { TechLogo } from '../ui/TechLogos';
import type { Profile, SiteSettings } from '../../types';

interface HeroSectionProps {
  profile: Profile;
  siteSettings?: SiteSettings;
}

function StatCounterItem({ targetValue, label }: { targetValue: number; label: string }) {
  const numericTarget = typeof targetValue === 'number' && !isNaN(targetValue) ? targetValue : (parseInt(String(targetValue), 10) || 0);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const duration = 1200;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * numericTarget);
            setCount(isNaN(currentVal) ? 0 : currentVal);
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(numericTarget);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numericTarget]);

  const showPlus = label.toLowerCase().indexOf('grad') === -1 && label.toLowerCase().indexOf('year') === -1;

  return (
    <div ref={ref} className="flex flex-col">
      <div className="font-display font-bold text-2xl sm:text-3xl text-text-primary flex items-baseline">
        <span>{isNaN(count) ? 0 : count}</span>
        {showPlus && <span className="text-secondary font-semibold ml-0.5">+</span>}
      </div>
      <span className="text-[11px] sm:text-xs font-mono uppercase text-text-muted mt-0.5">
        {label}
      </span>
    </div>
  );
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, siteSettings }) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [imageError, setImageError] = useState(false);

  // High-contrast rotating role line with cross-fade (no typing effect, AA contrast)
  useEffect(() => {
    if (!profile.role || profile.role.length <= 1) return;

    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % profile.role.length);
        setFadeState('in');
      }, 180); // Short cross-fade
    }, 3400);

    return () => clearInterval(interval);
  }, [profile.role]);

  const currentRole = profile.role && profile.role.length > 0 
    ? profile.role[roleIndex] 
    : "Full-Stack Developer";

  const getInitials = (name: string) => {
    if (!name) return 'AS';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const techStack = [
    { name: 'React', label: 'React 19' },
    { name: 'TypeScript', label: 'TypeScript' },
    { name: 'Python', label: 'Python' },
    { name: 'FastAPI', label: 'FastAPI' },
    { name: 'PostgreSQL', label: 'PostgreSQL' },
    { name: 'TailwindCSS', label: 'Tailwind CSS' },
    { name: 'Docker', label: 'Docker' },
    { name: 'NodeJS', label: 'Node.js' },
  ];

  const heroImgSrc = profile.heroImage || (profile as any).hero_image || '/images/hero.jpg';

  return (
    <section
      id="hero"
      aria-label="Hero Introduction"
      className="relative min-h-[100svh] flex flex-col justify-center pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-content mx-auto w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center flex-grow my-auto">
        {/* Left Column: Headline, Role, Pitch, CTAs, Stats, Tech */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Availability & Location Status Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-bg-card/90 border border-border shadow-sm mb-5 text-text-secondary backdrop-blur-md">
            <span className={`w-2 h-2 rounded-full ${siteSettings?.open_to_work ?? true ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-semibold text-text-primary">
              {siteSettings?.open_to_work ?? true 
                ? (siteSettings?.work_status_text || profile.availability || "Open to Opportunities")
                : "Focusing on Studies"}
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1 text-text-muted">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span>{profile.location}</span>
            </span>
          </div>

          {/* Primary Headline with gradient highlight */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight leading-[1.08]">
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary">
              {profile.name}
            </span>
          </h1>

          {/* Rotating Role Line with Fixed Reserved Height & High-Contrast Gradient Style */}
          <div className="mt-3 h-10 sm:h-12 flex items-center select-none" aria-live="polite">
            <span className="text-lg sm:text-2xl font-display font-medium text-text-secondary mr-2">
              Specialized in
            </span>
            <span
              className={`text-lg sm:text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary transition-opacity duration-200 ${
                fadeState === 'in' ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {currentRole}
            </span>
          </div>

          {/* One-Sentence Pitch */}
          <p className="mt-3 text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
            {profile.tagline}
          </p>

          {/* Primary Action CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="btn-glow inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-primary hover:bg-primary-light transition-all duration-200 shadow-md"
            >
              <Eye className="w-4 h-4" />
              <span>View Projects</span>
            </a>

            <a
              href={profile.resumeUrl}
              download="Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-text-primary bg-bg-card hover:bg-white/10 border border-border hover:border-primary/40 transition-all duration-200"
            >
              <FileText className="w-4 h-4 text-secondary" />
              <span>Download Resume</span>
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-text-primary bg-bg-card hover:bg-white/10 border border-border hover:border-accent/40 transition-all duration-200"
            >
              <Mail className="w-4 h-4 text-accent" />
              <span>Contact</span>
            </a>

            {/* Social Icons */}
            <div className="flex items-center gap-1.5 ml-1">
              {profile.socials?.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 border border-border/60 transition-colors"
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
                  className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 border border-border/60 transition-colors"
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
                  className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 border border-border/60 transition-colors"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.leetcode && (
                <a
                  href={profile.socials.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode Profile"
                  className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 border border-border/60 transition-colors font-mono text-xs font-bold"
                >
                  LC
                </a>
              )}
            </div>
          </div>

          {/* Compact Stat Row with Animated Numbers */}
          <div className="mt-8 pt-6 border-t border-border/60 w-full grid grid-cols-3 gap-4 max-w-lg">
            {profile.stats && profile.stats.length > 0 ? (
              profile.stats.slice(0, 3).map((st) => (
                <StatCounterItem key={st.label} targetValue={st.value} label={st.label} />
              ))
            ) : (
              <>
                <StatCounterItem targetValue={15} label="Projects" />
                <StatCounterItem targetValue={2} label="Internships" />
                <StatCounterItem targetValue={6} label="Certifications" />
              </>
            )}
          </div>

          {/* Tech I Use Row of Logos */}
          <div className="mt-6 pt-4 border-t border-border/40 w-full">
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted block mb-2.5">
              Core Technologies:
            </span>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  title={tech.label}
                  className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-card/70 border border-border hover:border-primary/50 transition-all duration-200 cursor-default"
                >
                  <div className="filter grayscale group-hover:grayscale-0 transition-all duration-200">
                    <TechLogo name={tech.name} className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-text-muted group-hover:text-text-primary transition-colors">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Hero Portrait Image Card with Floating Info Chips */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
          <div className="relative w-full max-w-[340px] sm:max-w-[390px] aspect-[4/5] rounded-3xl p-1 bg-gradient-to-b from-primary/40 via-border to-secondary/30 shadow-2xl">
            <div className="w-full h-full rounded-[22px] overflow-hidden bg-bg-card border border-white/10 relative flex items-center justify-center">
              {!imageError ? (
                <picture>
                  <source srcSet={heroImgSrc} type="image/jpeg" />
                  <img
                    src={heroImgSrc}
                    alt={`${profile.name}, ${profile.role?.[0] || 'Software Engineer'}`}
                    width="480"
                    height="560"
                    fetchPriority="high"
                    decoding="async"
                    style={{ objectPosition: profile.heroImagePosition || (profile as any).hero_image_position || 'center 20%' }}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={() => setImageError(true)}
                  />
                </picture>
              ) : (
                /* Fallback Initials Avatar */
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-bg-secondary to-bg-card p-6 text-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg mb-4">
                    <span className="font-display font-extrabold text-3xl text-white">
                      {getInitials(profile.name)}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary">
                    {profile.name}
                  </h3>
                </div>
              )}

              {/* Verified Full-Stack Badge */}
              <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-bg/90 backdrop-blur-md border border-border flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-text-primary font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Full-Stack Engineer</span>
                </span>
                <span className="font-mono text-emerald-400 text-[11px] font-semibold">Production Ready</span>
              </div>
            </div>

            {/* Floating Info Chips (stay still, max 6px hover float) */}
            <div className="absolute -top-3 -left-4 sm:-left-6 px-3 py-1.5 rounded-xl bg-bg-card/95 border border-primary/40 shadow-lg backdrop-blur-md flex items-center gap-2 transition-transform duration-300 hover:-translate-y-1.5 pointer-events-auto">
              <Code className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-text-primary">React 19 + FastAPI</span>
            </div>

            <div className="absolute top-1/2 -right-4 sm:-right-6 px-3 py-1.5 rounded-xl bg-bg-card/95 border border-emerald-500/40 shadow-lg backdrop-blur-md flex items-center gap-2 transition-transform duration-300 hover:-translate-y-1.5 pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-300">Open to Work</span>
            </div>

            <div className="absolute -bottom-3 -left-2 px-3 py-1.5 rounded-xl bg-bg-card/95 border border-secondary/40 shadow-lg backdrop-blur-md flex items-center gap-2 transition-transform duration-300 hover:-translate-y-1.5 pointer-events-auto">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span className="text-xs font-medium text-text-primary">{profile.location || 'Visakhapatnam, India'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Static Chevron at hero bottom edge */}
      <div className="mt-2 flex justify-center pb-2">
        <a
          href="#about"
          aria-label="Scroll to About Section"
          className="p-1.5 text-text-muted/60 hover:text-primary transition-colors focus:outline-none"
        >
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};
