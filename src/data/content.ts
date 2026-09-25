export interface StatItem {
  label: string;
  value: number | string;
  suffix?: string;
}

export interface ExperienceItem {
  company: string;
  title: string;
  period: string;
  points: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  tech: string[];
  image: string;
  live: string;
  repo: string;
  category: string;
  longDescription?: string;
  keyFeatures?: string[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
  avatar?: string;
}

export interface PortfolioContent {
  name: string;
  role: string[];
  tagline: string;
  bio: string;
  location: string;
  email: string;
  resumeUrl: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  stats: StatItem[];
  skills: {
    [category: string]: string[];
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
}

export const content: PortfolioContent = {
  name: "Jampa Durga Lakshmi Narayana",
  role: ["Computer Science Undergraduate", "Full-Stack Developer", "Software Engineer & AI Enthusiast"],
  tagline: "Computer Science Undergraduate at GITAM passionate about Full-Stack Development, Scalable Software, and AI-Driven Applications.",
  bio: "Computer Science undergraduate at GITAM Deemed to be University with a strong foundation in Data Structures & Algorithms, Object-Oriented Programming, Software Engineering, and Full-Stack Web Development. Passionate about building scalable software solutions and integrating Artificial Intelligence into real-world applications. Seeking Software Engineer or Full-Stack Developer opportunities to contribute to innovative products and continuously expand expertise in AI-driven software development.",
  location: "Visakhapatnam, Andhra Pradesh, India",
  email: "jampadurgalakshminarayana@gmail.com",
  resumeUrl: "/resume.pdf",
  socials: {
    github: "https://github.com/jampadurgalakshminarayana",
    linkedin: "https://linkedin.com/in/jampadurgalakshminarayana",
    twitter: "",
  },
  stats: [
    { label: "B.Tech CGPA", value: "8.17/10" },
    { label: "Intermediate", value: "93.9%" },
    { label: "DSA Solved", value: "100", suffix: "+" },
    { label: "Graduation", value: 2028 },
  ],
  skills: {
    "Languages": ["Java", "Python", "JavaScript", "C"],
    "Frontend": ["React.js", "HTML5", "CSS3", "Bootstrap", "Tailwind CSS"],
    "Backend": ["Node.js", "Express.js", "REST APIs", "JDBC"],
    "Databases": ["MySQL", "MongoDB"],
    "Core CS": ["Data Structures & Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks"],
    "AI & Tools": ["Generative AI", "Prompt Engineering", "Git", "GitHub", "VS Code"],
  },
  experience: [
    {
      company: "GITAM Deemed to be University",
      title: "Software Developer & Technical Community Member",
      period: "2024 - Present",
      points: [
        "Engineered database-driven applications including a Java JDBC Student Management System and modern web apps.",
        "Solved 100+ Data Structures & Algorithms problems across coding platforms focusing on arrays, strings, and OOP design.",
        "Actively participated in collegiate hackathons, collaborating to build software applications under tight time constraints.",
        "Consistently expanding expertise in Full-Stack Web Development, modern JavaScript/React, and Generative AI technologies.",
      ],
    },
  ],
  education: [
    {
      school: "GITAM Deemed to be University, Visakhapatnam",
      degree: "B.Tech in Computer Science and Engineering (CGPA: 8.17/10)",
      period: "2024 - 2028 (Expected)",
    },
    {
      school: "Sasi Junior College, Mandapeta",
      degree: "Intermediate (MPC - Mathematics, Physics, Chemistry) - 93.9%",
      period: "2022 - 2024",
    },
  ],
  projects: [
    {
      title: "Student Management System",
      description: "Java-based CRUD application for managing student academic records, grades, and enrollments with MySQL database integration using JDBC.",
      tech: ["Java", "MySQL", "JDBC", "OOP"],
      image: "/images/project-planner.jpg",
      live: "https://github.com/jampadurgalakshminarayana",
      repo: "https://github.com/jampadurgalakshminarayana/student-management-system",
      category: "Full-Stack",
      longDescription: "An Object-Oriented Java application utilizing JDBC drivers to execute transactional CRUD operations with parameterized queries against a normalized MySQL relational schema.",
      keyFeatures: [
        "Transactional CRUD operations for student records and profile attributes",
        "Optimized JDBC connection management and parameterized SQL queries to prevent injection",
        "Structured relational schema in MySQL with validation constraints and rollback capability",
      ],
    },
    {
      title: "Modern Full-Stack Personal Portfolio",
      description: "High-performance, responsive portfolio platform engineered with React.js, modern CSS, dynamic case studies, and interactive sections.",
      tech: ["React.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "JavaScript"],
      image: "/images/project-metrics.jpg",
      live: "https://github.com/jampadurgalakshminarayana",
      repo: "https://github.com/jampadurgalakshminarayana/portfolio",
      category: "Frontend",
      longDescription: "A fully responsive web application showcasing technical competencies, projects, certifications, and contact persistence with dark/light themes.",
      keyFeatures: [
        "Responsive design with dark/light visual theme persistence and smooth scrolling",
        "Interactive case-study views detailing problems, architecture, and technology stacks",
        "Contact form validation, anti-spam protection, and administrative inbox management",
      ],
    },
    {
      title: "Interactive Task Management Web Application",
      description: "Responsive task management application with task creation, editing, deletion, filtering, and completion tracking using dynamic DOM manipulation.",
      tech: ["JavaScript", "HTML5", "CSS3", "DOM API"],
      image: "/images/project-weather.jpg",
      live: "https://github.com/jampadurgalakshminarayana",
      repo: "https://github.com/jampadurgalakshminarayana/todo-list-app",
      category: "Frontend",
      longDescription: "A lightweight, responsive web application featuring real-time DOM manipulation, task priority tags, and browser local storage persistence.",
      keyFeatures: [
        "Dynamic task addition, in-place editing, deletion, and completion toggles",
        "Filter tasks by active, completed, or prioritized states with instant DOM updates",
        "Local storage synchronization for persistent task history between sessions",
      ],
    },
  ],
  testimonials: [],
};
