import { test, expect } from '@playwright/test'
import { AuthPage } from './pages/AuthPage'

test.describe('Authentication', () => {
  let authPage: AuthPage

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page)
  })

  test('login page loads correctly', async ({ page }) => {
    await authPage.gotoLogin()
    await expect(page).toHaveTitle(/EliteCommerce/)
    await expect(authPage.emailInput).toBeVisible()
    await expect(authPage.passwordInput).toBeVisible()
    await expect(authPage.submitButton).toBeVisible()
  })

  test('shows error on invalid login', async () => {
    await authPage.gotoLogin()
    await authPage.login('notreal@test.com', 'wrongpassword')
    await authPage.expectError()
  })

  test('signup page loads correctly', async () => {
    await authPage.gotoSignup()
    await expect(authPage.emailInput).toBeVisible()
    await expect(authPage.submitButton).toBeVisible()
  })
})