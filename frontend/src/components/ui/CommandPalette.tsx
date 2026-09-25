import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, User, Cpu, Briefcase, FolderGit2, Mail, Moon, Sun, FileText, ArrowRight, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { Project } from '../../types';

interface CommandPaletteProps {
  projects?: Project[];
  resumeUrl?: string;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ projects = [], resumeUrl = '/resume.pdf' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl/Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-home',
      title: 'Home / Hero',
      category: 'Navigation',
      icon: <Home className="w-4 h-4 text-primary" />,
      action: () => scrollToSection('hero'),
    },
    {
      id: 'nav-about',
      title: 'About Me & Background',
      category: 'Navigation',
      icon: <User className="w-4 h-4 text-secondary" />,
      action: () => scrollToSection('about'),
    },
    {
      id: 'nav-journey',
      title: 'Learning Journey & Milestones',
      category: 'Navigation',
      icon: <User className="w-4 h-4 text-primary" />,
      action: () => scrollToSection('journey'),
    },
    {
      id: 'nav-skills',
      title: 'Skills & Tooling',
      category: 'Navigation',
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
      action: () => scrollToSection('skills'),
    },
    {
      id: 'nav-experience',
      title: 'Experience & Education',
      category: 'Navigation',
      icon: <Briefcase className="w-4 h-4 text-amber-400" />,
      action: () => scrollToSection('experience'),
    },
    {
      id: 'nav-projects',
      title: 'Featured Projects',
      category: 'Navigation',
      icon: <FolderGit2 className="w-4 h-4 text-primary-light" />,
      action: () => scrollToSection('projects'),
    },
    {
      id: 'nav-certifications',
      title: 'Certifications & Credentials',
      category: 'Navigation',
      icon: <Briefcase className="w-4 h-4 text-secondary" />,
      action: () => scrollToSection('certifications'),
    },
    {
      id: 'nav-achievements',
      title: 'Achievements & Hackathons',
      category: 'Navigation',
      icon: <Briefcase className="w-4 h-4 text-accent" />,
      action: () => scrollToSection('achievements'),
    },
    {
      id: 'nav-contact',
      title: 'Contact Inquiries',
      category: 'Navigation',
      icon: <Mail className="w-4 h-4 text-secondary" />,
      action: () => scrollToSection('contact'),
    },
    // Projects
    ...projects.map((p) => ({
      id: `proj-${p.slug}`,
      title: `Project: ${p.title} (${p.category})`,
      category: 'Case Studies',
      icon: <FolderGit2 className="w-4 h-4 text-primary" />,
      action: () => {
        setIsOpen(false);
        navigate(`/projects/${p.slug}`);
      },
    })),
    // Actions
    {
      id: 'action-theme',
      title: `Toggle Theme (Currently: ${theme})`,
      category: 'Quick Actions',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />,
      action: () => {
        toggleTheme();
        setIsOpen(false);
      },
    },
    {
      id: 'action-resume',
      title: 'Download Resume (PDF)',
      category: 'Quick Actions',
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
      action: () => {
        window.open(resumeUrl, '_blank');
        setIsOpen(false);
      },
    },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-bg-card border border-border shadow-2xl overflow-hidden glass-panel"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-border gap-3">
          <Search className="w-5 h-5 text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search sections & projects..."
            className="w-full bg-transparent text-text-primary text-sm focus:outline-none placeholder:text-text-muted"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-text-muted hover:text-text-primary"
            aria-label="Close command palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border/20">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted font-mono">
              No matching commands or pages found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-sm transition-colors ${
                    isSelected ? 'bg-primary text-white shadow-sm' : 'text-text-primary hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={isSelected ? 'text-white' : ''}>{item.icon}</div>
                    <span className="font-medium text-xs sm:text-sm">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-bg-surface text-text-muted border border-border'
                      }`}
                    >
                      {item.category}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 opacity-60 ${isSelected ? 'opacity-100' : ''}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-bg-surface border-t border-border flex items-center justify-between text-[11px] text-text-muted font-mono">
          <span>Navigate with ↑ ↓, press Enter to select</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
