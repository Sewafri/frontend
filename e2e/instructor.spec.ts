import { test, expect } from '@playwright/test';

test.describe('Instructor Flow QA', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as instructor
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', 'sarah.mitchell@swafri.local');
    await page.fill('input[type="password"]', 'DemoPass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/instructor');
  });

  test('Instructor can navigate through core paths', async ({ page }) => {
    // 1. Check Dashboard
    await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();

    // 2. View Courses
    await page.click('a[href="/instructor/courses"]');
    await page.waitForURL('/instructor/courses');
    await expect(page.getByRole('heading', { name: /Courses/i })).toBeVisible();

    // 3. View Messages
    await page.click('a[href="/instructor/messages"]');
    await page.waitForURL('/instructor/messages');
    await expect(page.getByRole('heading', { name: /Messages/i })).toBeVisible();

    // 4. View Settings
    await page.click('a[href="/instructor/settings"]');
    await page.waitForURL('/instructor/settings');
    await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible();
  });
});
