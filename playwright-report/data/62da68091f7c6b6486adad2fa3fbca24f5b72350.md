# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Election Assistant E2E >> should navigate through the core user journey
- Location: e2e/app.spec.ts:4:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByPlaceholder(/Ask me anything/i) to be visible

```

# Page snapshot

```yaml
- generic [ref=e1]:
    - link "Skip to main content" [ref=e2] [cursor=pointer]:
        - /url: '#main-content'
    - navigation "Main Navigation" [ref=e3]:
        - generic [ref=e4]:
            - link "VoteAssist Home" [ref=e5] [cursor=pointer]:
                - /url: /
                - text: VoteAssist
            - generic [ref=e6]:
                - link "Home" [ref=e7] [cursor=pointer]:
                    - /url: /
                    - img [ref=e8]
                    - generic [ref=e11]: Home
                - link "Timeline" [ref=e12] [cursor=pointer]:
                    - /url: /timeline
                    - img [ref=e13]
                    - generic [ref=e15]: Timeline
                - link "Polling Place" [ref=e16] [cursor=pointer]:
                    - /url: /polling-place
                    - img [ref=e17]
                    - generic [ref=e20]: Polling Place
                - link "AI Assistant" [active] [ref=e21] [cursor=pointer]:
                    - /url: /assistant
                    - img [ref=e22]
                    - generic [ref=e24]: AI Assistant
                - button "Sign In" [ref=e26] [cursor=pointer]:
                    - img [ref=e27]
                    - generic [ref=e30]: Sign In
    - main [ref=e31]:
        - generic [ref=e33]:
            - generic [ref=e34]:
                - heading "AI Election Assistant" [level=1] [ref=e35]
                - paragraph [ref=e36]: Powered by Google Gemini
            - generic [ref=e37]:
                - log [ref=e39]:
                    - img [ref=e41]
                    - paragraph [ref=e45]:
                        - generic [ref=e46]: 'Assistant:'
                        - text: Hello! I am your AI Election Assistant. I can help answer questions about voter registration, ID requirements, absentee voting, or general election dates. How can I help you today?
                - generic [ref=e47]:
                    - generic [ref=e48]:
                        - textbox "Your message" [ref=e49]:
                            - /placeholder: Ask about voter ID, mail-in voting, or election dates...
                        - button "Send message" [disabled] [ref=e50]:
                            - img [ref=e51]
                    - generic [ref=e54]:
                        - img [ref=e55]
                        - generic [ref=e58]: AI can make mistakes. Always verify important information with your local election office.
    - contentinfo [ref=e59]:
        - generic [ref=e60]:
            - generic [ref=e61]:
                - generic [ref=e62]: VoteAssist
                - paragraph [ref=e63]: Demystifying the election process with clear timelines, localized info, and AI-powered assistance.
            - generic [ref=e64]:
                - generic [ref=e65]:
                    - heading "Resources" [level=4] [ref=e66]
                    - link "About Us" [ref=e67] [cursor=pointer]:
                        - /url: /about
                    - link "FAQ" [ref=e68] [cursor=pointer]:
                        - /url: /faq
                    - link "Privacy Policy" [ref=e69] [cursor=pointer]:
                        - /url: /privacy
                - generic [ref=e70]:
                    - heading "Connect" [level=4] [ref=e71]
                    - generic [ref=e72]:
                        - link "Twitter" [ref=e73] [cursor=pointer]:
                            - /url: https://twitter.com
                            - img [ref=e74]
                        - link "Github" [ref=e76] [cursor=pointer]:
                            - /url: https://github.com
                            - img [ref=e77]
                        - link "Email" [ref=e80] [cursor=pointer]:
                            - /url: mailto:hello@voteassist.com
                            - img [ref=e81]
        - paragraph [ref=e86]: © 2026 VoteAssist. Built with Google Services.
    - generic [ref=e91] [cursor=pointer]:
        - button "Open Next.js Dev Tools" [ref=e92]:
            - img [ref=e93]
        - generic [ref=e96]:
            - button "Open issues overlay" [ref=e97]:
                - generic [ref=e98]:
                    - generic [ref=e99]: '3'
                    - generic [ref=e100]: '4'
                - generic [ref=e101]:
                    - text: Issue
                    - generic [ref=e102]: s
            - button "Collapse issues badge" [ref=e103]:
                - img [ref=e104]
    - alert [ref=e106]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Election Assistant E2E', () => {
  4  |   test('should navigate through the core user journey', async ({ page }) => {
  5  |     // 1. Visit Home Page
  6  |     await page.goto('/');
  7  |     await expect(page.locator('h1')).toContainText('Navigate Your Voting Journey');
  8  |
  9  |     // 2. Navigate to Timeline
  10 |     await page.locator('nav').getByText('Timeline').first().click();
  11 |     await expect(page).toHaveURL(/.*timeline/);
  12 |     await expect(page.locator('h1')).toContainText('Election Timeline');
  13 |
  14 |     // 3. Navigate to Polling Place
  15 |     await page.locator('nav').getByText('Polling Place').first().click();
  16 |     await expect(page).toHaveURL(/.*polling-place/);
  17 |     await expect(page.locator('h1')).toContainText('Find Your Polling Place');
  18 |
  19 |     // Wait for hydration
  20 |     await page.waitForLoadState('networkidle');
  21 |     await page.waitForTimeout(1000);
  22 |
  23 |     // 4. Test Address Search
  24 |     await page.getByLabel('Registered Address').fill('1600 Pennsylvania Ave NW, Washington, DC');
  25 |     await page.getByRole('button', { name: /Find Location/i }).click();
  26 |
  27 |     // Wait for the result to appear (mocked response in 1.5s)
  28 |     await expect(page.getByText('Community Center Gymnasium')).toBeVisible({ timeout: 15000 });
  29 |
  30 |     // 5. Navigate to AI Assistant
  31 |     await page.locator('nav').getByText('AI Assistant').first().click();
  32 |     await expect(page).toHaveURL(/.*assistant/);
  33 |     await expect(page.locator('h1')).toContainText('AI Election Assistant');
  34 |     await page.waitForTimeout(2000);
  35 |
  36 |     // 6. Test AI Chat Interaction
  37 |     const chatInput = page.getByPlaceholder(/Ask me anything/i);
> 38 |     await chatInput.waitFor({ state: 'visible' });
     |                     ^ Error: locator.waitFor: Test timeout of 60000ms exceeded.
  39 |     await chatInput.fill('How do I register to vote?');
  40 |     await page.getByRole('button', { name: /Send/i }).click();
  41 |
  42 |     // Check for final reply
  43 |     await expect(page.getByText(/running in mock mode/i)).toBeVisible({ timeout: 20000 });
  44 |   });
  45 | });
  46 |
```
