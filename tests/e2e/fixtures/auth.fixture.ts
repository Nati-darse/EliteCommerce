import { test as base, Page } from '@playwright/test'

// Define what our custom fixtures look like
type AuthFixtures = {
  authenticatedPage: Page        
  guestPage: Page                 
}

export const test = base.extend<AuthFixtures>({
  // Authenticated page — uses saved storage state
  authenticatedPage: async ({ page }, use) => {
   
    await page.goto('/')
    await use(page)
  },

  guestPage: async ({ browser }, use) => {
    // Create a fresh context with NO storage state
    const context = await browser.newContext({ storageState: undefined })
    const page = await context.newPage()
    await use(page)
    await context.close()
  },
})

export { expect } from '@playwright/test'