import { test, expect } from '@playwright/test';

test.describe('Portfolio Full-Stack Smoke Tests', () => {

  test('1. Home: loads homepage, hero content, theme toggle, and sections', async ({ page }) => {
    await page.goto('/');

    // Verify Title & Hero presence
    await expect(page).toHaveTitle(/Full-Stack/i);
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toBeVisible();

    // Verify CTAs
    await expect(page.getByRole('link', { name: /view projects/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /resume/i }).first()).toBeVisible();

    // Verify key sections render
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#journey')).toBeVisible();
    await expect(page.locator('#skills')).toBeVisible();
    await expect(page.locator('#experience')).toBeVisible();
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('#achievements')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();

    // Verify empty sections are hidden gracefully
    await expect(page.locator('#certifications')).toHaveCount(0);

    // Verify Theme Toggle
    const themeToggle = page.locator('button[aria-label*="Switch to" i]').first();
    await expect(themeToggle).toBeVisible();
    const initialClass = await page.locator('html').getAttribute('class') || '';
    await themeToggle.click();
    const updatedClass = await page.locator('html').getAttribute('class') || '';
    expect(updatedClass).not.toBe(initialClass);
  });

  test('2. Project Case Study: navigates to project case study and renders details', async ({ page }) => {
    await page.goto('/projects/student-management-system');

    // Verify case study content
    await expect(page.locator('h1')).toContainText(/Student Management System/i);
    await expect(page.getByText(/The Problem & Motivation/i)).toBeVisible();
    await expect(page.getByText(/Architecture & Solution Design/i)).toBeVisible();
    await expect(page.getByText(/Core System Features/i)).toBeVisible();

    // Verify Back navigation
    const backBtn = page.getByRole('link', { name: /back to all projects/i });
    await expect(backBtn).toBeVisible();
  });

  test('3. Contact Form: submits inquiry and receives confirmation', async ({ page }) => {
    await page.goto('/');
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();

    // Fill form using exact input IDs
    await page.fill('#name', 'Playwright Tester');
    await page.fill('#email', 'playwright.test@example.com');
    await page.fill('#subject', 'Playwright Automated Smoke Test');
    await page.fill('#message', 'This is an automated smoke test validating end-to-end contact message persistence.');

    // Submit
    const submitBtn = page.locator('button[type="submit"]:has-text("Transmit Message")');
    await submitBtn.click();

    // Verify success confirmation
    await expect(page.getByText(/Message Transmitted!/i)).toBeVisible({ timeout: 10000 });
  });

  test('4. Admin Access Control: unauthenticated user cannot view admin dashboard', async ({ page }) => {
    // Clear session storage
    await page.goto('/admin');
    await page.evaluate(() => sessionStorage.removeItem('admin_token'));
    await page.reload();

    // Should display login screen, NOT control center
    await expect(page.getByText(/Owner Admin Console/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in to console/i })).toBeVisible();
    await expect(page.getByText(/Admin Control Center/i)).not.toBeVisible();
  });

  test('5. Admin Login & Logout: authenticates owner and clears session on sign out', async ({ page }) => {
    await page.goto('/admin');

    // Clear any existing session first
    await page.evaluate(() => sessionStorage.removeItem('admin_token'));
    await page.reload();

    // Fill credentials
    await page.fill('input[type="email"]', 'jampadurgalakshminarayana@gmail.com');
    await page.fill('input[type="password"]', 'AdminPass123!');

    // Sign in
    await page.click('button[type="submit"]:has-text("Sign In to Console")');

    // Verify Dashboard is displayed
    await expect(page.getByText(/Admin Control Center/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /export backup json/i })).toBeVisible();

    // Sign out
    const signOutBtn = page.getByRole('button', { name: /sign out/i });
    await expect(signOutBtn).toBeVisible();
    await signOutBtn.click();

    // Verify returned to login screen
    await expect(page.getByText(/Owner Admin Console/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Admin Control Center/i)).not.toBeVisible();
  });

});
