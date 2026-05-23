import { API_CONFIG } from '../config/constants.ts'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getToken(): string | null {
    return localStorage.getItem('token')
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = `${this.baseUrl}${endpoint}`

    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce(
          (acc, [key, value]) => {
            acc[key] = String(value)
            return acc
          },
          {} as Record<string, string>
        )
      ).toString()

      return queryString ? `${url}?${queryString}` : url
    }

    return url
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    const body = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      const errorMessage =
        typeof body === 'object' && body?.message
          ? body.message
          : typeof body === 'string'
            ? body
            : `HTTP Error: ${response.status}`

      const error = new Error(errorMessage) as Error & { status?: number }
      error.status = response.status

      if (response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }

      throw error
    }

    return body as T
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params)
    const headers = new Headers(options?.headers)

    const token = this.getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    headers.set('Content-Type', 'application/json')

    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers,
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params)
    const headers = new Headers(options?.headers)

    const token = this.getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    if (!(data instanceof FormData)) {
      headers.set('Content-Type', 'application/json')
    }

    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined

    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers,
      body,
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params)
    const headers = new Headers(options?.headers)

    const token = this.getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    if (!(data instanceof FormData)) {
      headers.set('Content-Type', 'application/json')
    }

    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined

    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers,
      body,
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params)
    const headers = new Headers(options?.headers)

    const token = this.getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    headers.set('Content-Type', 'application/json')

    const response = await fetch(url, {
      ...options,
      method: 'DELETE',
      headers,
    })

    return this.handleResponse<T>(response)
  }
}

export const apiClient = new ApiClient(API_CONFIG.BASE_URL)
