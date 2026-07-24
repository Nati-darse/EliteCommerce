
import { APIRequestContext } from '@playwright/test'

export class ApiClient {
  constructor(private request: APIRequestContext, private baseURL: string) {}

  async getProducts(params?: { category?: string; in_stock?: boolean }) {
    const url = new URL(`${this.baseURL}/api/products`)
    if (params?.category) url.searchParams.set('category', params.category)
    if (params?.in_stock !== undefined) {
      url.searchParams.set('in_stock', String(params.in_stock))
    }
    return this.request.get(url.toString())
  }

  async getProduct(id: string) {
    return this.request.get(`${this.baseURL}/api/products/${id}`)
  }

  async createProduct(data: {
    name: string
    price: number
    category: string
    in_stock?: boolean
  }) {
    return this.request.post(`${this.baseURL}/api/products`, { data })
  }

  async updateProduct(id: string, data: Partial<{
    name: string
    price: number
    in_stock: boolean
  }>) {
    return this.request.patch(`${this.baseURL}/api/products/${id}`, { data })
  }

  async deleteProduct(id: string) {
    return this.request.delete(`${this.baseURL}/api/products/${id}`)
  }
}