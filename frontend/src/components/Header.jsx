'use client'
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Info, Package, MessageSquare, Phone, User, LogIn, UserPlus } from "lucide-react"

export default function Header() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const getUserInitial = () => {
    if (session?.user?.name) {
      return session.user.name.charAt(0).toUpperCase()
    }
    return session?.user?.email?.charAt(0).toUpperCase() || 'U'
  }

  return (
    <>
      <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-xl backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
              <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-110">
                <Image 
                  src="/logo.png" 
                  alt="Book My Yoga" 
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-full h-full shadow-md"
                />
              </div>
              <span className="text-white font-bold text-lg md:text-xl tracking-wide">
                Book My Yoga
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <a 
                href="#home" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 hover:text-yellow-300 transition-all duration-200"
              >
                <Home size={18} />
                <span className="font-medium">Home</span>
              </a>
              <a 
                href="#about" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 hover:text-yellow-300 transition-all duration-200"
              >
                <Info size={18} />
                <span className="font-medium">About</span>
              </a>
              <a 
                href="#services" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 hover:text-yellow-300 transition-all duration-200"
              >
                <Package size={18} />
                <span className="font-medium">Services</span>
              </a>
              <a 
                href="#testimonials" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 hover:text-yellow-300 transition-all duration-200"
              >
                <MessageSquare size={18} />
                <span className="font-medium">Testimonials</span>
              </a>
              <a 
                href="#contact" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 hover:text-yellow-300 transition-all duration-200"
              >
                <Phone size={18} />
                <span className="font-medium">Contact</span>
              </a>
              
              {session ? (
                <div className="flex items-center space-x-3 ml-4">
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/booking">
                    <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-800 font-semibold">
                      Book Now
                    </Button>
                  </Link>
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {getUserInitial()}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <Link href="/sign-in">
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
                      <LogIn size={16} className="mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-800 font-semibold">
                      <UserPlus size={16} className="mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-3">
              {session && (
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {getUserInitial()}
                </div>
              )}
              
              <button
                onClick={toggleMobileMenu}
                className="text-white hover:text-yellow-300 transition-colors focus:outline-none p-1"
                aria-label="Toggle menu"
                ref={mobileMenuRef}
              >
                <div className="relative">
                  {isMobileMenuOpen ? (
                    <X size={24} className="transform rotate-180 transition-transform duration-200" />
                  ) : (
                    <Menu size={24} className="transition-transform duration-200" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Floating Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
          
          {/* Floating menu */}
          <div className="fixed top-20 right-4 left-4 z-50 lg:hidden">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-4 duration-300">
              <div className="p-2">
                <a 
                  href="#home" 
                  className="flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <Home size={20} className="text-gray-400" />
                  <span className="font-medium">Home</span>
                </a>
                <a 
                  href="#about" 
                  className="flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <Info size={20} className="text-gray-400" />
                  <span className="font-medium">About</span>
                </a>
                <a 
                  href="#services" 
                  className="flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <Package size={20} className="text-gray-400" />
                  <span className="font-medium">Services</span>
                </a>
                <a 
                  href="#testimonials" 
                  className="flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <MessageSquare size={20} className="text-gray-400" />
                  <span className="font-medium">Testimonials</span>
                </a>
                <a 
                  href="#contact" 
                  className="flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <Phone size={20} className="text-gray-400" />
                  <span className="font-medium">Contact</span>
                </a>
                
                {/* Action Buttons */}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  {session ? (
                    <div className="space-y-2">
                      <Link href="/dashboard" onClick={closeMobileMenu}>
                        <Button variant="outline" className="w-full justify-start">
                          <User size={16} className="mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/booking" onClick={closeMobileMenu}>
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/sign-in" onClick={closeMobileMenu}>
                        <Button variant="outline" className="w-full justify-start">
                          <LogIn size={16} className="mr-2" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/sign-up" onClick={closeMobileMenu}>
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                          <UserPlus size={16} className="mr-2" />
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
