'use client'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.accessToken) {
      fetchBookings()
    }
  }, [session])

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else {
        setError("Failed to fetch bookings")
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setError("An error occurred while fetching bookings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setBookings(bookings.filter(booking => booking.id !== bookingId))
      } else {
        alert("Failed to cancel booking")
      }
    } catch (error) {
      console.error("Error canceling booking:", error)
      alert("An error occurred while canceling the booking")
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const upcomingBookings = bookings.filter(booking => new Date(booking.date) >= new Date())
  const completedBookings = bookings.filter(booking => new Date(booking.date) < new Date())

  return (
    <div>
      {/* Main Content */}
      <main className="container-custom py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome, <span className="text-gradient">{session.user.name}</span>!
          </h1>
          <p className="text-xl text-gray-600">
            Your journey to peace and wellness starts here.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Your Upcoming Sessions
            </h2>
            
            <div className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <div key={booking.id} className="card flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {booking.yoga_type}
                      </h3>
                      <div className="space-y-1 text-gray-600">
                        <p className="flex items-center">
                          <span className="mr-2">📅</span>
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                        <p className="flex items-center">
                          <span className="mr-2">⏰</span>
                          {booking.time}
                        </p>
                        <p className="flex items-center">
                          <span className="mr-2">👨‍🏫</span>
                          Instructor: {booking.instructor}
                        </p>
                        {booking.notes && (
                          <p className="flex items-start">
                            <span className="mr-2">📝</span>
                            {booking.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <button 
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center">
                  <p className="text-gray-600 mb-4">
                    No upcoming sessions.
                  </p>
                  <Link href="/booking" className="btn-primary">
                    Book your first session!
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Stats
            </h2>
            
            <div className="space-y-4">
              <div className="card text-center">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {upcomingBookings.length}
                </h3>
                <p className="text-gray-600">Upcoming Sessions</p>
              </div>
              
              <div className="card text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {completedBookings.length}
                </h3>
                <p className="text-gray-600">Completed Sessions</p>
              </div>
              
              <div className="card text-center">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {bookings.length}
                </h3>
                <p className="text-gray-600">Total Bookings</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
