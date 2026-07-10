import { test, expect } from '@playwright/test';

test.describe('Student Flow QA', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as student
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', 'alice.chen@swafri.local');
    await page.fill('input[type="password"]', 'DemoPass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/my-learning');
  });

  test('Student can navigate through core paths', async ({ page }) => {
    // 1. Check My Learning dashboard
    await expect(page.getByRole('heading', { name: /My Learning/i })).toBeVisible();

    // 2. Explore Course Catalog
    await page.click('a[href="/courses"]');
    await page.waitForURL('/courses');
    await expect(page.getByRole('heading', { name: /Courses/i })).toBeVisible();

    // 3. View Certificates
    await page.click('a[href="/certificates"]');
    await page.waitForURL('/certificates');
    await expect(page.getByRole('heading', { name: /Certificates/i })).toBeVisible();

    // 4. View Wallet
    await page.click('a[href="/wallet"]');
    await page.waitForURL('/wallet');
    await expect(page.getByRole('heading', { name: /Achievement Wallet/i })).toBeVisible();

    // 5. View Wishlist
    await page.click('a[href="/wishlist"]');
    await page.waitForURL('/wishlist');
    await expect(page.getByRole('heading', { name: /Wishlist/i })).toBeVisible();

    // 6. View Messages
    await page.click('a[href="/messages"]');
    await page.waitForURL('/messages');
    await expect(page.getByRole('heading', { name: /Messages/i })).toBeVisible();

    // 7. View Notifications
    await page.click('a[href="/notifications"]');
    await page.waitForURL('/notifications');
    await expect(page.getByRole('heading', { name: /Notifications/i })).toBeVisible();

    // 8. View Settings
    await page.click('a[href="/settings"]');
    await page.waitForURL('/settings');
    await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible();
  });
});
