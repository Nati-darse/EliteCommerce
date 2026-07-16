import { test, expect } from './fixtures/index'
import { uniqueEmail } from './helpers/isolation'

// These tests are designed to run in parallel safely
// Each creates its own isolated data

test.describe('Parallel Safe — Products', () => {

  // Each test gets its own search term — no conflicts
  test('filter by electronics', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/products')

    const select = authenticatedPage.locator('select')
    await select.selectOption('electronics')

    await expect(
      authenticatedPage.getByText('Wireless Headphones')
    ).toBeVisible()

    await expect(
      authenticatedPage.getByText('Yoga Mat')
    ).not.toBeVisible()
  })

  test('filter by sports', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/products')

    const select = authenticatedPage.locator('select')
    await select.selectOption('sports')

    await expect(
      authenticatedPage.getByText('Yoga Mat')
    ).toBeVisible()

    await expect(
      authenticatedPage.getByText('Wireless Headphones')
    ).not.toBeVisible()
  })

  test('filter by kitchen', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/products')

    const select = authenticatedPage.locator('select')
    await select.selectOption('kitchen')

    await expect(
      authenticatedPage.getByText('Coffee Maker')
    ).toBeVisible()
  })

  test('search is case insensitive', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/products')

    await authenticatedPage
      .getByPlaceholder('Search products...')
      .fill('WIRELESS')

    await expect(
      authenticatedPage.getByText('Wireless Headphones')
    ).toBeVisible()
  })

})

test.describe('Parallel Safe — Auth', () => {

  // Each test creates a UNIQUE user — zero conflict even when parallel
  test('new user can sign up', async ({ guestPage, testUser }) => {
    await guestPage.goto('/signup')

    await guestPage.getByLabel('Email').fill(testUser.email)
    await guestPage.getByLabel('Password').fill('TestPassword123!')
    await guestPage.getByRole('button', { name: /sign up/i }).click()

    // testUser is auto-cleaned up after this test by the fixture
    // even if this test fails
  })

})