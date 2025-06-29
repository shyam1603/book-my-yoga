import { getSession, signOut } from "next-auth/react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export class ApiClient {
  static async request(endpoint, options = {}) {
    const session = await getSession()
    
    if (!session?.accessToken) {
      throw new Error('No access token available')
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
      
      if (response.status === 401) {
        // Token might be expired, try to refresh
        const refreshed = await this.refreshToken(session.refreshToken)
        if (refreshed) {
          // Retry the original request with new token
          const newSession = await getSession()
          config.headers.Authorization = `Bearer ${newSession.accessToken}`
          return fetch(`${API_BASE_URL}${endpoint}`, config)
        } else {
          // Refresh failed, sign out user
          signOut({ callbackUrl: '/sign-in' })
          throw new Error('Session expired')
        }
      }

      return response
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  static async refreshToken(refreshToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        // Update the session with new tokens
        // Note: This would require custom session update logic
        return true
      }
      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  // Booking API methods
  static async getBookings() {
    const response = await this.request('/api/bookings')
    return response.json()
  }

  static async createBooking(bookingData) {
    const response = await this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    })
    return response.json()
  }

  static async deleteBooking(bookingId) {
    const response = await this.request(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
    })
    return response.json()
  }

  static async getBooking(bookingId) {
    const response = await this.request(`/api/bookings/${bookingId}`)
    return response.json()
  }
}
