import { describe, it, expect } from 'vitest';
import { FALLBACK_PROFILE, FALLBACK_PROJECTS, FALLBACK_SKILLS, fetchProjectBySlug } from '../api/client';

describe('Portfolio Fallback Data Integrity', () => {
  it('loads valid profile fallback with required fields', () => {
    expect(FALLBACK_PROFILE.name).toBe('Jampa Durga Lakshmi Narayana');
    expect(FALLBACK_PROFILE.role.length).toBeGreaterThan(0);
    expect(FALLBACK_PROFILE.email).toBe('jampadurgalakshminarayana@gmail.com');
    expect(FALLBACK_PROFILE.stats.length).toBeGreaterThanOrEqual(3);
  });

  it('loads featured projects with case study attributes', () => {
    expect(FALLBACK_PROJECTS.length).toBeGreaterThanOrEqual(3);
    for (const proj of FALLBACK_PROJECTS) {
      expect(proj.slug).toBeTruthy();
      expect(proj.title).toBeTruthy();
      expect(proj.problem).toBeTruthy();
      expect(proj.solution).toBeTruthy();
      expect(proj.tech.length).toBeGreaterThan(0);
    }
  });

  it('loads structured skills categories', () => {
    expect(FALLBACK_SKILLS.length).toBeGreaterThanOrEqual(4);
    const categories = FALLBACK_SKILLS.map((s) => s.category);
    expect(categories).toContain('Programming Languages');
    expect(categories).toContain('Frontend Development');
    expect(categories).toContain('Backend & APIs');
  });

  it('retrieves project by slug fallback', async () => {
    const project = await fetchProjectBySlug('student-management-system');
    expect(project).toBeDefined();
    expect(project.title).toBe('Student Management System');
    expect(project.category).toBe('Full-Stack');
  });
});
