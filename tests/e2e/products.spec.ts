import { test, expect } from './fixtures/index'

test.describe('Products Page', () => {

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/products')
  })

  test('authenticated user sees product grid', async ({ authenticatedPage }) => {
    await expect(
      authenticatedPage.getByRole('heading', {name: 'products'})
    ).toBeVisible()
  })

  test('search filter works', async ({ authenticatedPage }) => {
    const searchInput = authenticatedPage.getByPlaceholder('Search products...')
    await searchInput.fill('headphones')

    // Only headphones should show
    await expect(
      authenticatedPage.getByText('Wireless Headphones')
    ).toBeVisible()

    await expect(
      authenticatedPage.getByText('Running Shoes')
    ).not.toBeVisible()
  })

  test('in stock filter works', async ({ authenticatedPage }) => {
    await authenticatedPage.getByLabel('In stock only').check()

    // Coffee Maker is out of stock — should be hidden
    await expect(
      authenticatedPage.getByText('Coffee Maker')
    ).not.toBeVisible()
  })

  test('reset button clears all filters', async ({ authenticatedPage }) => {
    await authenticatedPage.getByPlaceholder('Search products...').fill('shoes')
    await authenticatedPage.getByRole('button', { name: 'Reset' }).click()
    await expect(
      authenticatedPage.getByText('Wireless Headphones')
    ).toBeVisible()
  })

})

test.describe('Guest Access', () => {
  test('guest can view products without login', async ({ guestPage }) => {
    await guestPage.goto('/products')
    await expect(guestPage.getByRole('heading',{name :'Products'})).toBeVisible()
    
  })
})