# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Flow QA >> Admin can navigate through core paths
- Location: e2e/admin.spec.ts:13:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /Dashboard/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /Dashboard/i })

```

```yaml
- navigation:
  - link "S SewAfri":
    - /url: /
  - button "Collapse sidebar"
  - link "Overview":
    - /url: /admin
  - link "Users":
    - /url: /admin/users
  - link "Applications":
    - /url: /admin/applications
  - link "Courses":
    - /url: /admin/courses
  - link "Certificates":
    - /url: /admin/certificates
  - link "Payments":
    - /url: /admin/payments
  - link "Analytics":
    - /url: /admin/analytics
  - link "Reports":
    - /url: /admin/reports
  - link "Settings":
    - /url: /admin/settings
  - text: AU
  - paragraph: Admin User
  - paragraph: Admin
  - button "Sign Out"
- banner:
  - text: Admin / Overview
  - button
  - button
  - button "Switch to light mode"
  - button "AU"
- main:
  - heading "Admin Overview" [level=1]
  - paragraph: Platform-wide metrics and activity
  - paragraph: "20"
  - paragraph: 17 students · 2 instructors
  - paragraph: "13"
  - paragraph: 1 certificates issued
  - paragraph: $150.01
  - paragraph: Total confirmed payments
  - paragraph: "2"
  - paragraph: Needs attention
  - heading "Users by Role" [level=2]
  - text: Students 17 Instructors 2 Admins 1
  - heading "Revenue Breakdown" [level=2]
  - text: ONE TIME PURCHASE $150.01 SUBSCRIPTION $19.99
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Admin Flow QA', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Log in as admin
  6  |     await page.goto('/sign-in');
  7  |     await page.fill('input[type="email"]', 'admin@swafri.local');
  8  |     await page.fill('input[type="password"]', 'DemoPass123');
  9  |     await page.click('button[type="submit"]');
  10 |     await page.waitForURL('/admin');
  11 |   });
  12 | 
  13 |   test('Admin can navigate through core paths', async ({ page }) => {
  14 |     // 1. Check Dashboard
> 15 |     await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();
     |                                                                     ^ Error: expect(locator).toBeVisible() failed
  16 | 
  17 |     // 2. View Users
  18 |     await page.click('a[href="/admin/users"]');
  19 |     await page.waitForURL('/admin/users');
  20 |     await expect(page.getByRole('heading', { name: /Users/i })).toBeVisible();
  21 | 
  22 |     // 3. View Courses
  23 |     await page.click('a[href="/admin/courses"]');
  24 |     await page.waitForURL('/admin/courses');
  25 |     await expect(page.getByRole('heading', { name: /Courses/i })).toBeVisible();
  26 | 
  27 |     // 4. View Payments
  28 |     await page.click('a[href="/admin/payments"]');
  29 |     await page.waitForURL('/admin/payments');
  30 |     await expect(page.getByRole('heading', { name: /Payments/i })).toBeVisible();
  31 | 
  32 |     // 5. View Certificates
  33 |     await page.click('a[href="/admin/certificates"]');
  34 |     await page.waitForURL('/admin/certificates');
  35 |     await expect(page.getByRole('heading', { name: /Certificates/i })).toBeVisible();
  36 | 
  37 |     // 6. View Reports
  38 |     await page.click('a[href="/admin/reports"]');
  39 |     await page.waitForURL('/admin/reports');
  40 |     await expect(page.getByRole('heading', { name: /Reports/i })).toBeVisible();
  41 | 
  42 |     // 7. View Applications
  43 |     await page.click('a[href="/admin/applications"]');
  44 |     await page.waitForURL('/admin/applications');
  45 |     await expect(page.getByRole('heading', { name: /Applications/i })).toBeVisible();
  46 | 
  47 |     // 8. View Analytics
  48 |     await page.click('a[href="/admin/analytics"]');
  49 |     await page.waitForURL('/admin/analytics');
  50 |     await expect(page.getByRole('heading', { name: /Analytics/i })).toBeVisible();
  51 | 
  52 |     // 9. View Settings
  53 |     await page.click('a[href="/admin/settings"]');
  54 |     await page.waitForURL('/admin/settings');
  55 |     await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible();
  56 |   });
  57 | });
  58 | 
```