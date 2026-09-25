import type {
  Profile, SkillCategory, Experience, Education, Project,
  ContactSubmission, ContactMessage, SiteSettings,
  JourneyMilestone, Certification, Achievement, LearningItem
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Single source of truth dummy fallback
export const FALLBACK_PROFILE: Profile = {
  name: "Jampa Durga Lakshmi Narayana",
  role: [
    "Computer Science Undergraduate",
    "Full-Stack Developer",
    "Software Engineer & AI Enthusiast"
  ],
  tagline: "Computer Science Undergraduate at GITAM passionate about Full-Stack Development, Scalable Software, and AI-Driven Applications.",
  bio: "Computer Science undergraduate at GITAM Deemed to be University with a strong foundation in Data Structures & Algorithms, Object-Oriented Programming, Software Engineering, and Full-Stack Web Development. Passionate about building scalable software solutions and integrating Artificial Intelligence into real-world applications. Seeking Software Engineer or Full-Stack Developer opportunities to contribute to innovative products and continuously expand expertise in AI-driven software development.",
  location: "Visakhapatnam, Andhra Pradesh, India",
  email: "jampadurgalakshminarayana@gmail.com",
  resumeUrl: "/resume.pdf",
  heroImage: "/images/hero.jpg",
  heroImagePosition: "center 20%",
  availability: "Actively seeking Software Engineer & Full-Stack Developer Internships (Expected Graduation: 2028)",
  socials: {
    github: "https://github.com/jampadurgalakshminarayana",
    linkedin: "https://linkedin.com/in/jampadurgalakshminarayana",
    twitter: "",
    leetcode: "https://leetcode.com/jampadurgalakshminarayana"
  },
  stats: [
    { label: "Projects Built", value: 3 },
    { label: "DSA Solved", value: 100 },
    { label: "Graduation", value: 2028 }
  ]
};

export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  open_to_work: true,
  work_status_text: "Open to Software Engineering & Full-Stack Opportunities",
  resume_url: "/resume.pdf",
  theme_default: "dark",
  contact_email: "jampadurgalakshminarayana@gmail.com"
};

export const FALLBACK_SKILLS: SkillCategory[] = [
  {
    category: "Programming Languages",
    items: [
      { name: "Java", level: 85, logo: "java" },
      { name: "Python", level: 82, logo: "python" },
      { name: "JavaScript", level: 85, logo: "javascript" },
      { name: "C", level: 80, logo: "c" }
    ],
    order: 1
  },
  {
    category: "Frontend Development",
    items: [
      { name: "React.js", level: 84, logo: "react" },
      { name: "HTML5", level: 92, logo: "html5" },
      { name: "CSS3", level: 88, logo: "css3" },
      { name: "Bootstrap", level: 82, logo: "bootstrap" },
      { name: "Tailwind CSS", level: 85, logo: "tailwind" }
    ],
    order: 2
  },
  {
    category: "Backend & APIs",
    items: [
      { name: "Node.js", level: 80, logo: "nodejs" },
      { name: "Express.js", level: 80, logo: "express" },
      { name: "REST APIs", level: 85, logo: "api" },
      { name: "JDBC", level: 82, logo: "database" }
    ],
    order: 3
  },
  {
    category: "Databases & Storage",
    items: [
      { name: "MySQL", level: 85, logo: "mysql" },
      { name: "MongoDB", level: 78, logo: "mongodb" }
    ],
    order: 4
  },
  {
    category: "Core Computer Science",
    items: [
      { name: "Data Structures & Algorithms", level: 84, logo: "dsa" },
      { name: "Object-Oriented Programming (OOP)", level: 88, logo: "oop" },
      { name: "Database Management (DBMS)", level: 85, logo: "dbms" },
      { name: "Operating Systems", level: 80, logo: "os" },
      { name: "Computer Networks", level: 80, logo: "network" }
    ],
    order: 5
  },
  {
    category: "AI & Developer Tools",
    items: [
      { name: "Generative AI", level: 82, logo: "ai" },
      { name: "Prompt Engineering", level: 85, logo: "prompt" },
      { name: "AI-Assisted Development", level: 84, logo: "ai-dev" },
      { name: "Git", level: 85, logo: "git" },
      { name: "GitHub", level: 88, logo: "github" },
      { name: "VS Code", level: 90, logo: "vscode" }
    ],
    order: 6
  }
];

export const FALLBACK_LEARNING: LearningItem[] = [
  { id: 1, name: "Generative AI & LLM Integration", category: "Artificial Intelligence", status: "In Progress" },
  { id: 2, name: "Advanced Full-Stack Engineering (React & Node.js)", category: "Web Architecture", status: "In Progress" },
  { id: 3, name: "AI-Driven Software Architecture", category: "Systems Engineering", status: "In Progress" }
];

export const FALLBACK_JOURNEY: JourneyMilestone[] = [
  {
    id: 1,
    year: "2022 - 2024",
    title: "Academic Distinction in Intermediate (MPC)",
    description: "Graduated with 93.9% from Sasi Junior College, Mandapeta, building a rigorous analytical foundation in Mathematics, Physics, and logical problem-solving.",
    tag: "Foundation"
  },
  {
    id: 2,
    year: "2024",
    title: "Joined GITAM CSE & First Code in C / Java",
    description: "Commenced B.Tech in Computer Science and Engineering at GITAM Deemed to be University, Visakhapatnam. Mastered programming in C, Java, and Object-Oriented principles.",
    tag: "Milestone"
  },
  {
    id: 3,
    year: "2025",
    title: "Full-Stack Systems & Database Engineering",
    description: "Engineered Java JDBC CRUD applications with MySQL databases and developed responsive modern web frontends using HTML5, CSS3, JavaScript, and React.js.",
    tag: "Project Milestone"
  },
  {
    id: 4,
    year: "2025 - 2026",
    title: "DSA Mastery (100+ Solved), Hackathons & AI Integration",
    description: "Solved 100+ Data Structures & Algorithms problems across coding platforms, participated in engineering hackathons, and began integrating Generative AI into real-world software applications.",
    tag: "Current Focus"
  }
];

export const FALLBACK_CERTIFICATIONS: Certification[] = [
  {
    id: 1,
    title: "Java Programming Fundamentals",
    issuer: "Professional Certification",
    date: "2024",
    credential_url: "https://github.com/jampadurgalakshminarayana",
    badge_image: "/images/cert-aws.svg"
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    issuer: "Computer Science Domain",
    date: "2025",
    credential_url: "https://github.com/jampadurgalakshminarayana",
    badge_image: "/images/cert-pg.svg"
  },
  {
    id: 3,
    title: "Web Development Fundamentals",
    issuer: "Full-Stack Web Domain",
    date: "2024",
    credential_url: "https://github.com/jampadurgalakshminarayana",
    badge_image: "/images/cert-dl.svg"
  },
  {
    id: 4,
    title: "Git & GitHub Essentials",
    issuer: "DevOps & Version Control",
    date: "2024",
    credential_url: "https://github.com/jampadurgalakshminarayana",
    badge_image: "/images/cert-aws.svg"
  },
  {
    id: 5,
    title: "Artificial Intelligence Fundamentals",
    issuer: "AI & Emerging Technologies",
    date: "2025",
    credential_url: "https://github.com/jampadurgalakshminarayana",
    badge_image: "/images/cert-dl.svg"
  }
];

export const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: "100+ DSA Problems Solved",
    organization: "Coding Platforms (LeetCode / GeeksforGeeks)",
    description: "Solved 100+ Data Structures & Algorithms problems on coding platforms, building a strong foundation in algorithmic analysis and optimization.",
    date: "2024 - Present",
    url: "https://leetcode.com/jampadurgalakshminarayana",
    badge: "100+ Solved"
  },
  {
    id: 2,
    title: "Hackathon Participation & Project Building",
    organization: "Engineering Technical Communities",
    description: "Participated in collegiate hackathons and continuously build software development projects collaborating in team sprints.",
    date: "2024 - 2025",
    url: "https://github.com/jampadurgalakshminarayana",
    badge: "Hackathon Builder"
  },
  {
    id: 3,
    title: "Continuous Skill Expansion in Full-Stack & AI",
    organization: "Technical Exploration",
    description: "Consistently expanding technical depth across modern Full-Stack Web Development, React, Node.js, and Generative AI technologies.",
    date: "2025",
    url: "https://github.com/jampadurgalakshminarayana",
    badge: "Continuous Learner"
  }
];

export const FALLBACK_EXPERIENCE: Experience[] = [
  {
    id: 1,
    company: "GITAM Deemed to be University",
    title: "Software Developer & Technical Community Member",
    period: "2024 - Present",
    points: [
      "Engineered database-driven applications including a Java JDBC Student Management System and modern web apps.",
      "Solved 100+ Data Structures & Algorithms problems across coding platforms focusing on arrays, strings, and OOP design.",
      "Actively participated in collegiate hackathons, collaborating to build software applications under tight time constraints.",
      "Consistently expanding expertise in Full-Stack Web Development, modern JavaScript/React, and Generative AI technologies."
    ]
  }
];

export const FALLBACK_EDUCATION: Education[] = [
  {
    id: 1,
    school: "GITAM Deemed to be University, Visakhapatnam",
    degree: "B.Tech in Computer Science and Engineering (CGPA: 8.17/10)",
    period: "2024 - 2028 (Expected)"
  },
  {
    id: 2,
    school: "Sasi Junior College, Mandapeta",
    degree: "Intermediate (MPC - Mathematics, Physics, Chemistry) - 93.9%",
    period: "2022 - 2024"
  }
];

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    slug: "student-management-system",
    title: "Student Management System",
    summary: "Java-based CRUD application for managing student academic records, grades, and enrollments with MySQL database integration using JDBC.",
    problem: "Academic administrations require secure, structured, and persistent software tools to manage student enrollments, record updates, and academic progress without data corruption.",
    solution: "Designed and developed an Object-Oriented Java application utilizing JDBC drivers to execute transactional CRUD operations with parameterized queries against a normalized MySQL relational schema.",
    features: [
      "Transactional CRUD operations for student records and profile attributes",
      "Optimized JDBC connection management and parameterized SQL queries to prevent injection",
      "Structured relational schema in MySQL with validation constraints and rollback capability",
      "Intuitive interface for rapid student record search, grade updates, and reporting"
    ],
    architecture: "Layered architectural pattern separating UI presentation, Business Service Logic, and Data Access Object (DAO) layers with JDBC driver abstraction connecting to MySQL Server.",
    learnings: "Gained deep hands-on expertise with database transactions, JDBC connection lifecycles, SQL constraint management, and Object-Relational mapping in Java.",
    tech: ["Java", "MySQL", "JDBC", "OOP"],
    category: "Full-Stack",
    image: "/images/project-planner.jpg",
    gallery: [
      "/images/project-planner.jpg",
      "/images/project-metrics.jpg"
    ],
    live: "https://github.com/jampadurgalakshminarayana",
    repo: "https://github.com/jampadurgalakshminarayana/student-management-system",
    featured: true
  },
  {
    id: 2,
    slug: "personal-portfolio-website",
    title: "Modern Full-Stack Personal Portfolio",
    summary: "High-performance, responsive portfolio platform engineered with React.js, modern CSS, dynamic case studies, and interactive sections.",
    problem: "Standard static resumes lack dynamic proof of skills, real-time interactivity, and the ability to showcase architectural case studies effectively.",
    solution: "Designed and developed a fully responsive web application showcasing technical competencies, projects, certifications, and contact persistence.",
    features: [
      "Responsive design with dark/light visual theme persistence and smooth scrolling",
      "Interactive case-study views detailing problems, architecture, and technology stacks",
      "Contact form validation, anti-spam protection, and administrative inbox management",
      "Command palette (Ctrl+K) for instant keyboard navigation across all sections"
    ],
    architecture: "Single Page Application powered by React 19, TypeScript, and Tailwind CSS with client-side routing, TanStack Query caching, and FastAPI backend integration.",
    learnings: "Mastered component modularity, state management, accessibility (WCAG AA), responsive breakpoints (360px-1920px), and modern web performance optimizations.",
    tech: ["React.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "JavaScript"],
    category: "Frontend",
    image: "/images/project-metrics.jpg",
    gallery: [
      "/images/project-metrics.jpg",
      "/images/project-weather.jpg"
    ],
    live: "https://github.com/jampadurgalakshminarayana",
    repo: "https://github.com/jampadurgalakshminarayana/portfolio",
    featured: true
  },
  {
    id: 3,
    slug: "todo-list-web-app",
    title: "Interactive Task Management Web Application",
    summary: "Responsive task management application with task creation, editing, deletion, filtering, and completion tracking using dynamic DOM manipulation.",
    problem: "Users need a clutter-free, responsive tool to track daily deliverables with instant feedback and persistent task states.",
    solution: "Built a lightweight, responsive web application featuring real-time DOM manipulation, task priority tags, and browser local storage persistence.",
    features: [
      "Dynamic task addition, in-place editing, deletion, and completion toggles",
      "Filter tasks by active, completed, or prioritized states with instant DOM updates",
      "Clean, accessible UI built with responsive CSS and keyboard navigation",
      "Local storage synchronization for persistent task history between sessions"
    ],
    architecture: "Event-driven client architecture leveraging vanilla JavaScript / React DOM manipulation, modular event listeners, and LocalStorage state persistence.",
    learnings: "Deepened understanding of JavaScript Event Loop, DOM lifecycle events, state mutations, and creating responsive UI components with clean CSS3.",
    tech: ["JavaScript", "HTML5", "CSS3", "DOM API"],
    category: "Frontend",
    image: "/images/project-weather.jpg",
    gallery: [
      "/images/project-weather.jpg",
      "/images/project-vision.jpg"
    ],
    live: "https://github.com/jampadurgalakshminarayana",
    repo: "https://github.com/jampadurgalakshminarayana/todo-list-app",
    featured: true
  }
];

export const FALLBACK_TESTIMONIALS: any[] = [];


// Token Helpers
export function getAdminToken(): string | null {
  return sessionStorage.getItem('admin_token');
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem('admin_token', token);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem('admin_token');
}

export function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// Public API Fetchers
export async function fetchProfile(): Promise<Profile> {
  try {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return {
      ...data,
      resumeUrl: data.resume_url || data.resumeUrl || '/resume.pdf',
      heroImage: data.hero_image || data.heroImage || '/images/hero.jpg',
      heroImagePosition: data.hero_image_position || data.heroImagePosition || 'center 20%'
    };
  } catch (err) {
    console.warn('API fallback for profile:', err);
    return FALLBACK_PROFILE;
  }
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for settings:', err);
    return FALLBACK_SITE_SETTINGS;
  }
}

export async function fetchSkills(): Promise<SkillCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/skills`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for skills:', err);
    return FALLBACK_SKILLS;
  }
}

export async function fetchLearningItems(): Promise<LearningItem[]> {
  try {
    const res = await fetch(`${API_BASE}/skills/learning/items`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for learning items:', err);
    return FALLBACK_LEARNING;
  }
}

export async function fetchJourneyMilestones(): Promise<JourneyMilestone[]> {
  try {
    const res = await fetch(`${API_BASE}/journey`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for journey:', err);
    return FALLBACK_JOURNEY;
  }
}

export async function fetchCertifications(): Promise<Certification[]> {
  try {
    const res = await fetch(`${API_BASE}/certifications`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for certifications:', err);
    return FALLBACK_CERTIFICATIONS;
  }
}

export async function fetchAchievements(): Promise<Achievement[]> {
  try {
    const res = await fetch(`${API_BASE}/achievements`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for achievements:', err);
    return FALLBACK_ACHIEVEMENTS;
  }
}

export async function fetchExperience(): Promise<Experience[]> {
  try {
    const res = await fetch(`${API_BASE}/experience`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for experience:', err);
    return FALLBACK_EXPERIENCE;
  }
}

export async function fetchEducation(): Promise<Education[]> {
  try {
    const res = await fetch(`${API_BASE}/education`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for education:', err);
    return FALLBACK_EDUCATION;
  }
}

export async function fetchProjects(category?: string): Promise<Project[]> {
  try {
    const url = category && category !== 'All' 
      ? `${API_BASE}/projects?category=${encodeURIComponent(category)}`
      : `${API_BASE}/projects`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fallback for projects:', err);
    if (category && category !== 'All') {
      return FALLBACK_PROJECTS.filter(p => p.category === category);
    }
    return FALLBACK_PROJECTS;
  }
}

export async function fetchProjectBySlug(slug: string): Promise<Project> {
  try {
    const res = await fetch(`${API_BASE}/projects/${slug}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`API fallback for project slug ${slug}:`, err);
    const p = FALLBACK_PROJECTS.find(item => item.slug === slug);
    if (p) return p;
    throw new Error('Project not found');
  }
}

export async function submitContact(data: ContactSubmission): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to submit' }));
    throw new Error(err.detail || 'Failed to submit message');
  }
  return { success: true, message: 'Message sent successfully!' };
}

// Admin API Operations
export async function loginAdmin(email: string, password: string): Promise<{ access_token: string }> {
  const res = await fetch(`${API_BASE}/auth/login-json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(err.detail || 'Invalid email or password');
  }
  const data = await res.json();
  setAdminToken(data.access_token);
  return data;
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  } catch {
    // Ignore network error during logout
  }
  clearAdminToken();
}

export async function checkAdminAuth(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update site settings');
  return await res.json();
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  const d = data as any;
  const payload = {
    ...data,
    resume_url: data.resumeUrl || d.resume_url,
    hero_image: data.heroImage || d.hero_image,
    hero_image_position: data.heroImagePosition || d.hero_image_position
  };
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return await res.json();
}

export async function exportBackupJson(): Promise<void> {
  const res = await fetch(`${API_BASE}/backup/export`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to export backup');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Admin Project CRUD
export async function createProject(data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create project');
  return await res.json();
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update project');
  return await res.json();
}

export async function deleteProject(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete project');
}

// Admin Skills CRUD
export async function createSkill(data: Partial<SkillCategory>): Promise<SkillCategory> {
  const res = await fetch(`${API_BASE}/skills`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create skill group');
  return await res.json();
}

export async function updateSkill(id: number, data: Partial<SkillCategory>): Promise<SkillCategory> {
  const res = await fetch(`${API_BASE}/skills/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update skill group');
  return await res.json();
}

export async function deleteSkill(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/skills/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete skill group');
}

// Admin Learning Items CRUD
export async function createLearningItem(data: Partial<LearningItem>): Promise<LearningItem> {
  const res = await fetch(`${API_BASE}/skills/learning/items`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create learning item');
  return await res.json();
}

export async function updateLearningItem(id: number, data: Partial<LearningItem>): Promise<LearningItem> {
  const res = await fetch(`${API_BASE}/skills/learning/items/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update learning item');
  return await res.json();
}

export async function deleteLearningItem(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/skills/learning/items/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete learning item');
}

// Admin Journey CRUD
export async function createJourneyMilestone(data: Partial<JourneyMilestone>): Promise<JourneyMilestone> {
  const res = await fetch(`${API_BASE}/journey`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create milestone');
  return await res.json();
}

export async function updateJourneyMilestone(id: number, data: Partial<JourneyMilestone>): Promise<JourneyMilestone> {
  const res = await fetch(`${API_BASE}/journey/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update milestone');
  return await res.json();
}

export async function deleteJourneyMilestone(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/journey/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete milestone');
}

// Admin Certifications CRUD
export async function createCertification(data: Partial<Certification>): Promise<Certification> {
  const res = await fetch(`${API_BASE}/certifications`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create certification');
  return await res.json();
}

export async function updateCertification(id: number, data: Partial<Certification>): Promise<Certification> {
  const res = await fetch(`${API_BASE}/certifications/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update certification');
  return await res.json();
}

export async function deleteCertification(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/certifications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete certification');
}

// Admin Achievements CRUD
export async function createAchievement(data: Partial<Achievement>): Promise<Achievement> {
  const res = await fetch(`${API_BASE}/achievements`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create achievement');
  return await res.json();
}

export async function updateAchievement(id: number, data: Partial<Achievement>): Promise<Achievement> {
  const res = await fetch(`${API_BASE}/achievements/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update achievement');
  return await res.json();
}

export async function deleteAchievement(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/achievements/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete achievement');
}

// Admin Experience CRUD
export async function createExperience(data: Partial<Experience>): Promise<Experience> {
  const res = await fetch(`${API_BASE}/experience`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create experience');
  return await res.json();
}

export async function updateExperience(id: number, data: Partial<Experience>): Promise<Experience> {
  const res = await fetch(`${API_BASE}/experience/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update experience');
  return await res.json();
}

export async function deleteExperience(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/experience/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete experience');
}

// Admin Education CRUD
export async function createEducation(data: Partial<Education>): Promise<Education> {
  const res = await fetch(`${API_BASE}/education`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create education record');
  return await res.json();
}

export async function updateEducation(id: number, data: Partial<Education>): Promise<Education> {
  const res = await fetch(`${API_BASE}/education/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update education record');
  return await res.json();
}

export async function deleteEducation(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/education/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete education record');
}

// Admin Contact Inquiries
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const res = await fetch(`${API_BASE}/contact`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to load inquiries');
  return await res.json();
}

export async function toggleMessageHandled(id: number): Promise<ContactMessage> {
  const res = await fetch(`${API_BASE}/contact/${id}/handle`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to toggle handled status');
  return await res.json();
}

export async function deleteContactMessage(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/contact/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete inquiry');
}

// Image & File Upload
export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Upload failed');
  }
  return await res.json();
}
