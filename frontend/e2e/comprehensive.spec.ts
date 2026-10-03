import { test, expect } from '@playwright/test';

test.describe('Comprehensive Verification Suite', () => {

  test('1. Social links and Resume links', async ({ page }) => {
    await page.goto('/');

    // Check resume download link
    const resumeLinks = page.locator('a[href="/resume.pdf"]');
    await expect(resumeLinks.first()).toBeVisible();

    // Check social links security
    const githubLink = page.locator('a[aria-label="GitHub Profile"]').first();
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    const linkedinLink = page.locator('a[aria-label="LinkedIn Profile"]').first();
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
    await expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('2. Command Palette (Ctrl+K)', async ({ page }) => {
    await page.goto('/');

    // Press Control+k
    await page.keyboard.press('Control+KeyK');
    const cmdPalette = page.locator('[role="dialog"], input[placeholder*="Type a command or search" i]');
    await expect(cmdPalette.first()).toBeVisible();

    // Escape to close
    await page.keyboard.press('Escape');
  });

  test('3. 404 Not Found Page', async ({ page }) => {
    await page.goto('/non-existent-route-for-testing-404');
    await expect(page.getByText(/404/i).or(page.getByText(/Page Not Found/i))).toBeVisible();
    await expect(page.getByRole('link', { name: /Return Home/i })).toBeVisible();
  });

  test('4. Responsive Viewports: no horizontal overflow at 360, 768, 1024, 1440', async ({ page }) => {
    const viewports = [
      { width: 360, height: 740 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    }
  });

  test('5. Admin Inquiries List and Delete Message', async ({ page, request }) => {
    // Ensure an inquiry exists in the database
    await request.post('http://localhost:8000/api/v1/contact', {
      data: {
        name: 'Playwright Tester',
        email: 'playwright.test@example.com',
        subject: 'Playwright Automated Verification',
        message: 'Validating end-to-end admin contact message display and deletion.'
      }
    });

    await page.goto('/admin');
    await page.fill('input[type="email"]', 'jampadurgalakshminarayana@gmail.com');
    await page.fill('input[type="password"]', 'AdminPass123!');
    await page.click('button[type="submit"]:has-text("Sign In to Console")');

    await expect(page.getByText(/Admin Control Center/i)).toBeVisible();

    // Inquiries tab is active by default
    await expect(page.getByText(/Playwright Tester/i).first()).toBeVisible();

    // Delete message
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    const deleteBtn = page.locator('button[title*="Delete" i], button:has-text("Delete")').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(1000);
    }
  });

});
