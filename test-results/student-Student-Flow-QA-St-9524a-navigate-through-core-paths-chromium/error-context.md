# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: student.spec.ts >> Student Flow QA >> Student can navigate through core paths
- Location: e2e/student.spec.ts:13:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /Courses/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /Courses/i })

```

```yaml
- navigation:
  - link "S SewAfri":
    - /url: /
  - button "Collapse sidebar"
  - link "Courses":
    - /url: /courses
  - link "My Learning":
    - /url: /my-learning
  - link "Certificates":
    - /url: /certificates
  - link "Wallet":
    - /url: /wallet
  - link "Payments":
    - /url: /payments
  - link "Wishlist":
    - /url: /wishlist
  - link "Subscription":
    - /url: /subscription
  - link "Messages":
    - /url: /messages
  - link "Settings":
    - /url: /settings
  - text: AC
  - paragraph: Alice Chen
  - paragraph: Student
  - button "Sign Out"
- banner:
  - text: Student / Learning
  - button
  - button
  - button "Switch to light mode"
  - button "AC"
- main:
  - heading "Course Catalog" [level=1]
  - paragraph: Browse our full catalog of courses
  - textbox "Search courses":
    - /placeholder: Search courses...
  - button "All"
  - button "Governance"
  - button "Security"
  - button "DeFi"
  - button "NFTs"
  - button "Blockchain"
  - button "Smart Contracts"
  - link "Governance DAO Governance & Tokenomics Design and deploy decentralized autonomous organizations. Covers governance token design, voting mechanisms (quadratic, conviction, optimistic), treasury management, and real-world DAO case studies. dao, governance, tokenomics Prof. James Okafor Free":
    - /url: /courses/cmrezn4h60011c5v0kl5vgdse
    - text: Governance
    - heading "DAO Governance & Tokenomics" [level=3]
    - paragraph: Design and deploy decentralized autonomous organizations. Covers governance token design, voting mechanisms (quadratic, conviction, optimistic), treasury management, and real-world DAO case studies.
    - text: dao, governance, tokenomics Prof. James Okafor Free
  - link "Security Web3 Security & Auditing Learn to find and prevent smart contract vulnerabilities. Covers reentrancy, flash loan attacks, oracle manipulation, access control flaws, and professional auditing methodology. security, auditing, vulnerabilities Dr. Sarah Mitchell $0":
    - /url: /courses/cmrezn4h90012c5v0xotiuqum
    - text: Security
    - heading "Web3 Security & Auditing" [level=3]
    - paragraph: Learn to find and prevent smart contract vulnerabilities. Covers reentrancy, flash loan attacks, oracle manipulation, access control flaws, and professional auditing methodology.
    - text: security, auditing, vulnerabilities Dr. Sarah Mitchell $0
  - link "DeFi Advanced DeFi Protocols Dive deep into decentralized finance. Understand automated market makers (Uniswap v3), lending protocols (Aave), yield optimization strategies, and the economic design patterns that power the DeFi ecosystem. defi, amm, lending Dr. Sarah Mitchell $0":
    - /url: /courses/cmrezn4gx000zc5v0f5ailquh
    - text: DeFi
    - heading "Advanced DeFi Protocols" [level=3]
    - paragraph: Dive deep into decentralized finance. Understand automated market makers (Uniswap v3), lending protocols (Aave), yield optimization strategies, and the economic design patterns that power the DeFi ecosystem.
    - text: defi, amm, lending Dr. Sarah Mitchell $0
  - link "NFTs NFT Development & Marketplace Design Build production-grade NFT projects. Learn ERC-721/1155 standards, metadata best practices, IPFS storage, marketplace smart contracts, and royalty enforcement. Includes a complete marketplace dApp project. nft, erc-721, ipfs Prof. James Okafor $79.99":
    - /url: /courses/cmrezn4h20010c5v0hy0aqq4v
    - text: NFTs
    - heading "NFT Development & Marketplace Design" [level=3]
    - paragraph: Build production-grade NFT projects. Learn ERC-721/1155 standards, metadata best practices, IPFS storage, marketplace smart contracts, and royalty enforcement. Includes a complete marketplace dApp project.
    - text: nft, erc-721, ipfs Prof. James Okafor $79.99
  - link "Blockchain Blockchain Fundamentals A beginner-friendly introduction to blockchain technology. Learn what blocks, chains, and consensus mean, how wallets work, and why this technology matters beyond cryptocurrency. No prior knowledge required. blockchain, basics, web3 Dr. Sarah Mitchell Free":
    - /url: /courses/cmrezn4gp000xc5v0kduusz0n
    - text: Blockchain
    - heading "Blockchain Fundamentals" [level=3]
    - paragraph: A beginner-friendly introduction to blockchain technology. Learn what blocks, chains, and consensus mean, how wallets work, and why this technology matters beyond cryptocurrency. No prior knowledge required.
    - text: blockchain, basics, web3 Dr. Sarah Mitchell Free
  - link "Smart Contracts Solidity Smart Contract Development Go from zero to deployment-ready Solidity developer. Covers layout of a Solidity file, data locations, function modifiers, inheritance, interfaces, and best practices for writing secure smart contracts on Ethereum. solidity, smart-contracts, ethereum Dr. Sarah Mitchell $49.99":
    - /url: /courses/cmrezn4gu000yc5v0e9qfvxnc
    - text: Smart Contracts
    - heading "Solidity Smart Contract Development" [level=3]
    - paragraph: Go from zero to deployment-ready Solidity developer. Covers layout of a Solidity file, data locations, function modifiers, inheritance, interfaces, and best practices for writing secure smart contracts on Ethereum.
    - text: solidity, smart-contracts, ethereum Dr. Sarah Mitchell $49.99
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Student Flow QA', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Log in as student
  6  |     await page.goto('/sign-in');
  7  |     await page.fill('input[type="email"]', 'alice.chen@swafri.local');
  8  |     await page.fill('input[type="password"]', 'DemoPass123');
  9  |     await page.click('button[type="submit"]');
  10 |     await page.waitForURL('/my-learning');
  11 |   });
  12 | 
  13 |   test('Student can navigate through core paths', async ({ page }) => {
  14 |     // 1. Check My Learning dashboard
  15 |     await expect(page.getByRole('heading', { name: /My Learning/i })).toBeVisible();
  16 | 
  17 |     // 2. Explore Course Catalog
  18 |     await page.click('a[href="/courses"]');
  19 |     await page.waitForURL('/courses');
> 20 |     await expect(page.getByRole('heading', { name: /Courses/i })).toBeVisible();
     |                                                                   ^ Error: expect(locator).toBeVisible() failed
  21 | 
  22 |     // 3. View Certificates
  23 |     await page.click('a[href="/certificates"]');
  24 |     await page.waitForURL('/certificates');
  25 |     await expect(page.getByRole('heading', { name: /Certificates/i })).toBeVisible();
  26 | 
  27 |     // 4. View Wallet
  28 |     await page.click('a[href="/wallet"]');
  29 |     await page.waitForURL('/wallet');
  30 |     await expect(page.getByRole('heading', { name: /Achievement Wallet/i })).toBeVisible();
  31 | 
  32 |     // 5. View Wishlist
  33 |     await page.click('a[href="/wishlist"]');
  34 |     await page.waitForURL('/wishlist');
  35 |     await expect(page.getByRole('heading', { name: /Wishlist/i })).toBeVisible();
  36 | 
  37 |     // 6. View Messages
  38 |     await page.click('a[href="/messages"]');
  39 |     await page.waitForURL('/messages');
  40 |     await expect(page.getByRole('heading', { name: /Messages/i })).toBeVisible();
  41 | 
  42 |     // 7. View Notifications
  43 |     await page.click('a[href="/notifications"]');
  44 |     await page.waitForURL('/notifications');
  45 |     await expect(page.getByRole('heading', { name: /Notifications/i })).toBeVisible();
  46 | 
  47 |     // 8. View Settings
  48 |     await page.click('a[href="/settings"]');
  49 |     await page.waitForURL('/settings');
  50 |     await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible();
  51 |   });
  52 | });
  53 | 
```