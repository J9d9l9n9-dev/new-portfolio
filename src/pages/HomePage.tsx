import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchProfile,
  fetchSiteSettings,
  fetchSkills,
  fetchLearningItems,
  fetchJourneyMilestones,
  fetchCertifications,
  fetchAchievements,
  fetchExperience,
  fetchEducation,
  fetchProjects,
} from '../api/client';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { JourneySection } from '../components/sections/JourneySection';
import { SkillsSection } from '../components/sections/SkillsSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { CertificationsSection } from '../components/sections/CertificationsSection';
import { AchievementsSection } from '../components/sections/AchievementsSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { ContactSection } from '../components/sections/ContactSection';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const { data: siteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: fetchSiteSettings,
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
  });

  const { data: learningItems = [] } = useQuery({
    queryKey: ['learning-items'],
    queryFn: fetchLearningItems,
  });

  const { data: journey = [] } = useQuery({
    queryKey: ['journey'],
    queryFn: fetchJourneyMilestones,
  });

  const { data: certifications = [] } = useQuery({
    queryKey: ['certifications'],
    queryFn: fetchCertifications,
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: fetchAchievements,
  });

  const { data: experience = [] } = useQuery({
    queryKey: ['experience'],
    queryFn: fetchExperience,
  });

  const { data: education = [] } = useQuery({
    queryKey: ['education'],
    queryFn: fetchEducation,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjects(),
  });

  if (isProfileLoading && !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-text-primary px-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-text-secondary">
          Initializing Portfolio Core Systems...
        </p>
      </div>
    );
  }

  if (profileError && !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-text-primary px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-display font-bold text-xl text-text-primary mb-2">
          Unable to Initialize Portfolio
        </h2>
        <p className="text-xs text-text-muted max-w-sm mb-6">
          Could not communicate with the backend service. Click below to retry.
        </p>
        <button
          onClick={() => refetchProfile()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-primary hover:bg-primary-light transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <HeroSection profile={profile} siteSettings={siteSettings} />
      <div className="section-divider" />
      <AboutSection profile={profile} />
      <div className="section-divider" />
      <JourneySection milestones={journey} />
      <div className="section-divider" />
      <SkillsSection skills={skills} learningItems={learningItems} />
      <div className="section-divider" />
      <ExperienceSection experience={experience} education={education} />
      <div className="section-divider" />
      <ProjectsSection projects={projects} />
      <div className="section-divider" />
      <CertificationsSection certifications={certifications} />
      <div className="section-divider" />
      <AchievementsSection achievements={achievements} />
      <div className="section-divider" />
      <TestimonialsSection />
      <div className="section-divider" />
      <ContactSection profile={profile} />
    </>
  );
};
