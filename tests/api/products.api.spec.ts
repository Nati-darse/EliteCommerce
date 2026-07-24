import { test, expect } from '@playwright/test'
import { ApiClient } from './helpers/api-client'

const BASE_URL = 'http://localhost:3000'

// Track created product IDs for cleanup
let createdProductIds: string[] = []

test.describe('Products API', () => {

  let api: ApiClient

  test.beforeEach(async ({ request }) => {
    api = new ApiClient(request, BASE_URL)
  })

  test.afterAll(async ({ request }) => {
    // Clean up any products created during tests
    const api = new ApiClient(request, BASE_URL)
    for (const id of createdProductIds) {
      await api.deleteProduct(id)
    }
    createdProductIds = []
  })

  // ─── GET /api/products ───────────────────────────────────────

  test.describe('GET /api/products', () => {

    test('returns 200 with correct shape', async () => {
      const response = await api.getProducts()

      expect(response.status()).toBe(200)

      const body = await response.json()

      // Schema validation — checks the shape, not specific values
      expect(body).toMatchObject({
        products: expect.any(Array),
        count: expect.any(Number),
      })

      expect(body.count).toBe(body.products.length)
    })

    test('each product has required fields', async () => {
      const response = await api.getProducts()
      const { products } = await response.json()

      // Check first product has the right shape
      if (products.length > 0) {
        expect(products[0]).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
          category: expect.any(String),
          in_stock: expect.any(Boolean),
        })
      }
    })

    test('filters by category', async () => {
      const response = await api.getProducts({ category: 'electronics' })
      const { products } = await response.json()

      expect(response.status()).toBe(200)
      products.forEach((p: any) => {
        expect(p.category).toBe('electronics')
      })
    })

    test('filters by in_stock', async () => {
      const response = await api.getProducts({ in_stock: true })
      const { products } = await response.json()

      expect(response.status()).toBe(200)
      products.forEach((p: any) => {
        expect(p.in_stock).toBe(true)
      })
    })

  })

  // ─── POST /api/products ──────────────────────────────────────

  test.describe('POST /api/products', () => {

    test('creates product and returns 201', async () => {
      const newProduct = {
        name: `Test Product ${Date.now()}`,
        price: 49.99,
        category: 'electronics',
        in_stock: true,
      }

      const response = await api.createProduct(newProduct)

      expect(response.status()).toBe(201)

      const { product } = await response.json()

      // Track for cleanup
      createdProductIds.push(product.id)

      // Verify created product matches what we sent
      expect(product).toMatchObject({
        id: expect.any(String),
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category,
        in_stock: newProduct.in_stock,
      })
    })

    test('returns 422 when name is missing', async () => {
      const response = await api.createProduct({
        name: '',         // invalid
        price: 99,
        category: 'electronics',
      })

      expect(response.status()).toBe(422)

      const body = await response.json()
      expect(body.error).toBe('Validation failed')
      expect(body.details).toEqual(expect.any(Array))
      expect(body.details.length).toBeGreaterThan(0)
    })

    test('returns 422 when price is negative', async () => {
      const response = await api.createProduct({
        name: 'Bad Product',
        price: -10,       // invalid
        category: 'electronics',
      })

      expect(response.status()).toBe(422)
    })

    test('returns 422 when category is missing', async () => {
      const response = await api.createProduct({
        name: 'No Category Product',
        price: 50,
        category: '',     // invalid
      })

      expect(response.status()).toBe(422)
    })

    test('returns 400 for invalid JSON', async ({ request }) => {
      // Send raw malformed JSON
      const response = await request.post(`${BASE_URL}/api/products`, {
        data: 'not valid json at all',
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status()).toBe(400)
    })

  })

  // ─── GET /api/products/:id ───────────────────────────────────

  test.describe('GET /api/products/:id', () => {

    test('returns 200 with product for valid id', async () => {
      // First get all products to grab a real ID
      const listResponse = await api.getProducts()
      const { products } = await listResponse.json()

      if (products.length === 0) {
        test.skip() // no products to test with
        return
      }

      const targetId = products[0].id
      const response = await api.getProduct(targetId)

      expect(response.status()).toBe(200)

      const { product } = await response.json()
      expect(product.id).toBe(targetId)
    })

    test('returns 404 for non-existent id', async () => {
      const response = await api.getProduct('00000000-0000-0000-0000-000000000000')

      expect(response.status()).toBe(404)

      const body = await response.json()
      expect(body.error).toBe('Product not found')
    })

  })

  // ─── Full lifecycle test ─────────────────────────────────────

  test('full CRUD lifecycle', async () => {
    // CREATE
    const createRes = await api.createProduct({
      name: `Lifecycle Test ${Date.now()}`,
      price: 75,
      category: 'sports',
      in_stock: true,
    })
    expect(createRes.status()).toBe(201)
    const { product } = await createRes.json()
    const id = product.id

    // READ
    const getRes = await api.getProduct(id)
    expect(getRes.status()).toBe(200)
    const { product: fetched } = await getRes.json()
    expect(fetched.name).toBe(product.name)

    // UPDATE
    const updateRes = await api.updateProduct(id, { price: 99, in_stock: false })
    expect(updateRes.status()).toBe(200)
    const { product: updated } = await updateRes.json()
    expect(updated.price).toBe(99)
    expect(updated.in_stock).toBe(false)

    // DELETE
    const deleteRes = await api.deleteProduct(id)
    expect(deleteRes.status()).toBe(200)

    // VERIFY DELETED
    const verifyRes = await api.getProduct(id)
    expect(verifyRes.status()).toBe(404)
  })

})