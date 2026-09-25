export interface StatItem {
  label: string;
  value: number;
}

export interface Socials {
  github?: string;
  linkedin?: string;
  twitter?: string;
  leetcode?: string;
  [key: string]: string | undefined;
}

export interface Profile {
  id?: number;
  name: string;
  role: string[];
  tagline: string;
  bio: string;
  location: string;
  email: string;
  resumeUrl: string;
  heroImage: string;
  heroImagePosition?: string;
  availability: string;
  socials: Socials;
  stats: StatItem[];
}

export interface SiteSettings {
  id?: number;
  open_to_work: boolean;
  work_status_text: string;
  resume_url: string;
  theme_default: string;
  contact_email: string;
}

export interface SkillItem {
  name: string;
  level?: string | number;
  logo?: string;
}

export interface SkillCategory {
  id?: number;
  category: string;
  items?: (string | SkillItem)[];
  chips?: string[];
  order?: number;
  is_published?: boolean;
}

export interface LearningItem {
  id?: number;
  name: string;
  category?: string;
  status?: string;
  order?: number;
  is_published?: boolean;
}

export interface JourneyMilestone {
  id?: number;
  year: string;
  title: string;
  description: string;
  tag?: string;
  order?: number;
  is_published?: boolean;
}

export interface Certification {
  id?: number;
  title: string;
  issuer: string;
  date: string;
  credential_url?: string;
  badge_image?: string;
  order?: number;
  is_published?: boolean;
}

export interface Achievement {
  id?: number;
  title: string;
  organization: string;
  description: string;
  date: string;
  url?: string;
  badge?: string;
  order?: number;
  is_published?: boolean;
}

export interface Experience {
  id?: number;
  company: string;
  title: string;
  period: string;
  points: string[];
  order?: number;
  is_published?: boolean;
}

export interface Education {
  id?: number;
  school: string;
  degree: string;
  period: string;
  order?: number;
  is_published?: boolean;
}

export interface Project {
  id?: number;
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  features: string[];
  architecture?: string;
  learnings?: string;
  tech: string[];
  category: string;
  image: string;
  gallery?: string[];
  live?: string;
  repo?: string;
  featured?: boolean;
  order?: number;
  is_published?: boolean;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export interface ContactMessage extends ContactSubmission {
  id: number;
  created_at: string;
  is_read: boolean;
  is_handled?: boolean;
}
