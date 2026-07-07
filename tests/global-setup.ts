import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' }) 
import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Log in with your real test account
  await page.goto(`${baseURL}/login`)
  await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL!)
  await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD!)
  await page.getByRole('button', { name: /sign in/i }).click()

  // Wait for redirect — means login succeeded
  await page.waitForURL(`${baseURL}/shop`)

  // Save auth state (cookies + localStorage) to a file
  await page.context().storageState({ path: 'tests/.auth/user.json' })

  await browser.close()
}

export default globalSetup