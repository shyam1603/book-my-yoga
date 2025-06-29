'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, User, Heart, MessageSquare, Sparkles, CheckCircle, AlertCircle } from "lucide-react"

const timeSlots = [
  { value: "Morning (8:00 AM - 10:00 AM)", label: "Morning", time: "8:00 AM - 10:00 AM", icon: "🌅" },
  { value: "Afternoon (12:00 PM - 2:00 PM)", label: "Afternoon", time: "12:00 PM - 2:00 PM", icon: "☀️" },
  { value: "Evening (5:00 PM - 7:00 PM)", label: "Evening", time: "5:00 PM - 7:00 PM", icon: "🌆" },
]

const yogaTypes = [
  { value: "Hatha Yoga", label: "Hatha Yoga", description: "Gentle and slow-paced", color: "bg-green-100 text-green-700", icon: "🧘‍♀️" },
  { value: "Vinyasa Flow", label: "Vinyasa Flow", description: "Dynamic flowing movements", color: "bg-blue-100 text-blue-700", icon: "🌊" },
  { value: "Yin Yoga", label: "Yin Yoga", description: "Deep stretching and relaxation", color: "bg-purple-100 text-purple-700", icon: "🌙" },
  { value: "Ashtanga Yoga", label: "Ashtanga Yoga", description: "Traditional and athletic", color: "bg-orange-100 text-orange-700", icon: "🔥" },
  { value: "Restorative Yoga", label: "Restorative Yoga", description: "Healing and therapeutic", color: "bg-pink-100 text-pink-700", icon: "💆‍♀️" },
  { value: "Prenatal Yoga", label: "Prenatal Yoga", description: "Safe for expecting mothers", color: "bg-yellow-100 text-yellow-700", icon: "🤱" },
]

const instructors = [
  { value: "Atanu Pathak", name: "Atanu Pathak", specialty: "Hatha & Meditation", experience: "8+ years", rating: "4.9" },
  { value: "Michael Chen", name: "Michael Chen", specialty: "Vinyasa Flow", experience: "6+ years", rating: "4.8" },
  { value: "Priya Patel", name: "Priya Patel", specialty: "Yin & Restorative", experience: "10+ years", rating: "4.9" },
  { value: "David Wilson", name: "David Wilson", specialty: "Ashtanga & Power", experience: "7+ years", rating: "4.7" },
]

export default function Booking() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    yoga_type: "",
    instructor: "",
    notes: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/sign-in")
  }, [status])

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const { date, time, yoga_type, instructor } = formData
    if (!date || !time || !yoga_type || !instructor) {
      setError("Please fill in all required fields.")
      setIsLoading(false)
      return
    }

    if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
      setError("Please select a future date.")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (res.ok) {
        setSuccess("Booking confirmed successfully!")
        setFormData({ date: "", time: "", yoga_type: "", instructor: "", notes: "" })
        setTimeout(() => router.push("/dashboard"), 2000)
      } else {
        setError(data.detail || "Failed to create booking")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your session...</p>
        </div>
      </div>
    )
  }
  
  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Book Your Yoga Journey
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your perfect yoga experience with our expert instructors and tranquil environment
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Booking Form */}
        <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Date Selection */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    <span>Select Date *</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.date}
                      onChange={e => handleChange("date", e.target.value)}
                      disabled={isLoading}
                      className="h-14 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    <span>Choose Time *</span>
                  </Label>
                  <Select value={formData.time} onValueChange={val => handleChange("time", val)} disabled={isLoading}>
                    <SelectTrigger className="h-14 text-lg border-2 border-gray-200 bg-white focus:border-indigo-500 rounded-xl">
                      <SelectValue placeholder="Select your preferred time" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl bg-white shadow-lg">
                      {timeSlots.map(slot => (
                        <SelectItem key={slot.value} value={slot.value} className="py-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{slot.icon}</span>
                            <div>
                              <div className="font-medium">{slot.label}</div>
                              <div className="text-sm text-gray-500">{slot.time}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Yoga Type Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-indigo-500" />
                  <span>Yoga Style *</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {yogaTypes.map(type => (
                    <div
                      key={type.value}
                      onClick={() => handleChange("yoga_type", type.value)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        formData.yoga_type === type.value
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{type.icon}</span>
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${type.color}`}>
                          {type.label}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <User className="w-5 h-5 text-indigo-500" />
                  <span>Choose Instructor *</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {instructors.map(instructor => (
                    <div
                      key={instructor.value}
                      onClick={() => handleChange("instructor", instructor.value)}
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        formData.instructor === instructor.value
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-800">{instructor.name}</h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-medium text-gray-600">{instructor.rating}</span>
                        </div>
                      </div>
                      <p className="text-indigo-600 font-medium mb-1">{instructor.specialty}</p>
                      <p className="text-sm text-gray-500">{instructor.experience} experience</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-indigo-500" />
                  <span>Special Requests</span>
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={e => handleChange("notes", e.target.value)}
                  placeholder="Tell us about any specific needs, injuries, or preferences..."
                  rows={4}
                  disabled={isLoading}
                  className="border-2 border-gray-200 focus:border-indigo-500 rounded-xl resize-none transition-all duration-200"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading || !formData.date || !formData.time || !formData.yoga_type || !formData.instructor}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Confirming Your Booking...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirm My Yoga Session</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/60 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧘‍♀️</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Expert Guidance</h3>
              <p className="text-sm text-gray-600">Learn from certified instructors with years of experience</p>
            </div>
            <div className="text-center p-6 bg-white/60 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Flexible Scheduling</h3>
              <p className="text-sm text-gray-600">Book sessions that fit your busy lifestyle</p>
            </div>
            <div className="text-center p-6 bg-white/60 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Personalized Experience</h3>
              <p className="text-sm text-gray-600">Tailored sessions based on your goals and preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}