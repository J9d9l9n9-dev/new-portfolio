import { test, expect } from '@playwright/test';
import * as path from 'path';

test('Verify Cleaned Projects, Real Images, Filters, and Command Palette', async ({ page }) => {
  // 1. Visit Homepage #projects
  await page.goto('http://localhost:5173/#projects');
  await page.waitForLoadState('networkidle');

  // Verify Project Count
  const projectCards = page.locator('#projects .grid > div');
  await expect(projectCards).toHaveCount(3);

  // Verify individual project titles
  const titles = await page.locator('#projects h3').allTextContents();
  console.log('Project Titles displayed on Homepage:', titles);
  expect(titles.some(t => t.includes('AI Skin Intelligence'))).toBeTruthy();
  expect(titles.some(t => t.includes('ASHA EHR Companion'))).toBeTruthy();
  expect(titles.some(t => t.includes('Full-Stack Developer Portfolio'))).toBeTruthy();
  expect(titles.some(t => t.toLowerCase().includes('attendance'))).toBeFalsy();
  expect(titles.some(t => t.toLowerCase().includes('currency'))).toBeFalsy();
  expect(titles.some(t => t.toLowerCase().includes('student management'))).toBeFalsy();

  // Verify Real Image for Full-Stack Developer Portfolio
  const portfolioCard = page.locator('#projects .grid > div', { hasText: 'Full-Stack Developer Portfolio' });
  const portfolioImg = portfolioCard.locator('img');
  await expect(portfolioImg).toHaveAttribute('src', '/images/projects/developer-portfolio/hero.png');

  // 2. Test Category Filters (Simplified: no filter pills cluttering 3 projects)
  const filterButtons = page.locator('#projects button');
  const filterCount = await filterButtons.count();
  console.log(`Found ${filterCount} category filters (simplified clean bento grid)`);
  expect(filterCount).toBe(0);

  // 3. Test Command Palette (Ctrl+K)
  await page.keyboard.press('Control+k');
  const commandDialog = page.locator('div[role="dialog"]');
  await expect(commandDialog).toBeVisible();

  // Search Currency -> 0 results
  const searchInput = commandDialog.locator('input');
  await searchInput.fill('Currency');
  await page.waitForTimeout(200);
  expect(await commandDialog.locator('text=Real-Time Currency Converter').count()).toBe(0);

  // Search Student -> 0 results
  await searchInput.fill('Student Management');
  await page.waitForTimeout(200);
  expect(await commandDialog.locator('text=Student Management System').count()).toBe(0);

  // Search Attendance -> 0 results
  await searchInput.fill('Attendance');
  await page.waitForTimeout(200);
  expect(await commandDialog.locator('text=Attendance Management System').count()).toBe(0);

  // Search Portfolio -> 1 result
  await searchInput.fill('Portfolio');
  await page.waitForTimeout(200);
  await expect(commandDialog.locator('text=Full-Stack Developer Portfolio')).toBeVisible();

  // Close palette with Escape
  await page.keyboard.press('Escape');
  await expect(commandDialog).not.toBeVisible();

  // 4. Navigate to /projects/developer-portfolio
  await page.goto('http://localhost:5173/projects/developer-portfolio');
  await page.waitForLoadState('networkidle');

  // Verify Case Study Details
  await expect(page.locator('h1')).toContainText('Full-Stack Developer Portfolio');
  const heroImage = page.locator('img[alt="Full-Stack Developer Portfolio screenshot 1"]');
  await expect(heroImage).toHaveAttribute('src', '/images/projects/developer-portfolio/hero.png');

  // Test Lightbox
  const galleryThumb = page.locator('div.cursor-pointer').first();
  await galleryThumb.click();
  const lightboxModal = page.locator('div[role="dialog"][aria-label="Image Preview"]');
  await expect(lightboxModal).toBeVisible();
  // Press Escape to close lightbox
  await page.keyboard.press('Escape');
  await expect(lightboxModal).not.toBeVisible();

  // 5. Test Invalid/Removed route /projects/currency-converter
  await page.goto('http://localhost:5173/projects/currency-converter');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('text=Project Not Found')).toBeVisible();
  await expect(page.locator('text=Back to Portfolio')).toBeVisible();

  // 6. Test Invalid/Removed route /projects/student-management-system
  await page.goto('http://localhost:5173/projects/student-management-system');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('text=Project Not Found')).toBeVisible();
  await expect(page.locator('text=Back to Portfolio')).toBeVisible();

  // 7. Test Invalid/Removed route /projects/attendance-management-system
  await page.goto('http://localhost:5173/projects/attendance-management-system');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('text=Project Not Found')).toBeVisible();
  await expect(page.locator('text=Back to Portfolio')).toBeVisible();

  console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
});
