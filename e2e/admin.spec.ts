import { test, expect } from '@playwright/test';

test.describe('Admin Flow QA', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as admin
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', 'admin@swafri.local');
    await page.fill('input[type="password"]', 'DemoPass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('Admin can navigate through core paths', async ({ page }) => {
    // 1. Check Dashboard
    await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();

    // 2. View Users
    await page.click('a[href="/admin/users"]');
    await page.waitForURL('/admin/users');
    await expect(page.getByRole('heading', { name: /Users/i })).toBeVisible();

    // 3. View Courses
    await page.click('a[href="/admin/courses"]');
    await page.waitForURL('/admin/courses');
    await expect(page.getByRole('heading', { name: /Courses/i })).toBeVisible();

    // 4. View Payments
    await page.click('a[href="/admin/payments"]');
    await page.waitForURL('/admin/payments');
    await expect(page.getByRole('heading', { name: /Payments/i })).toBeVisible();

    // 5. View Certificates
    await page.click('a[href="/admin/certificates"]');
    await page.waitForURL('/admin/certificates');
    await expect(page.getByRole('heading', { name: /Certificates/i })).toBeVisible();

    // 6. View Reports
    await page.click('a[href="/admin/reports"]');
    await page.waitForURL('/admin/reports');
    await expect(page.getByRole('heading', { name: /Reports/i })).toBeVisible();

    // 7. View Applications
    await page.click('a[href="/admin/applications"]');
    await page.waitForURL('/admin/applications');
    await expect(page.getByRole('heading', { name: /Applications/i })).toBeVisible();

    // 8. View Analytics
    await page.click('a[href="/admin/analytics"]');
    await page.waitForURL('/admin/analytics');
    await expect(page.getByRole('heading', { name: /Analytics/i })).toBeVisible();

    // 9. View Settings
    await page.click('a[href="/admin/settings"]');
    await page.waitForURL('/admin/settings');
    await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible();
  });
});
