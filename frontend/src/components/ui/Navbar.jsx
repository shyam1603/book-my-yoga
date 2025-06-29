'use client'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, LayoutDashboard, Calendar, LogOut } from 'lucide-react'

function Navbar() {
    const { data: session } = useSession()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const dropdownRef = useRef(null)
    const mobileMenuRef = useRef(null)
    const pathname = usePathname()

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLogout = () => {
        signOut({ callbackUrl: "/" })
        setIsDropdownOpen(false)
        setIsMobileMenuOpen(false)
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const getUserInitial = () => {
        if (session?.user?.name) {
            return session.user.name.charAt(0).toUpperCase()
        }
        return session?.user?.email?.charAt(0).toUpperCase() || 'U'
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    const isActive = (path) => pathname === path

    return (
        <>
            <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-xl sticky top-0 z-40">
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
                            <Link 
                                href="/" 
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                    isActive('/') 
                                        ? 'bg-white/20 text-yellow-300 shadow-lg backdrop-blur-sm' 
                                        : 'text-white hover:bg-white/10 hover:text-yellow-300'
                                }`}
                            >
                                <Home size={18} />
                                <span className="font-medium">Home</span>
                            </Link>
                            <Link 
                                href="/dashboard" 
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                    isActive('/dashboard') 
                                        ? 'bg-white/20 text-yellow-300 shadow-lg backdrop-blur-sm' 
                                        : 'text-white hover:bg-white/10 hover:text-yellow-300'
                                }`}
                            >
                                <LayoutDashboard size={18} />
                                <span className="font-medium">Dashboard</span>
                            </Link>
                            <Link 
                                href="/booking" 
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                    isActive('/booking') 
                                        ? 'bg-white/20 text-yellow-300 shadow-lg backdrop-blur-sm' 
                                        : 'text-white hover:bg-white/10 hover:text-yellow-300'
                                }`}
                            >
                                <Calendar size={18} />
                                <span className="font-medium">Book Session</span>
                            </Link>
                            
                            {session && (
                                <div className="relative ml-4" ref={dropdownRef}>
                                    <button
                                        onClick={toggleDropdown}
                                        className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-800 rounded-full flex items-center justify-center font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-lg transform hover:scale-105"
                                    >
                                        {getUserInitial()}
                                    </button>

                                    {/* Desktop Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50 backdrop-blur-sm">
                                            <div className="px-5 py-4 border-b border-gray-100">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                                                        {getUserInitial()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {session.user.name || 'User'}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {session.user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="py-2">
                                                <Link
                                                    href="/dashboard"
                                                    className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <LayoutDashboard size={18} className="mr-3 text-indigo-500" />
                                                    <span className="font-medium">Dashboard</span>
                                                </Link>
                                                <Link
                                                    href="/booking"
                                                    className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <Calendar size={18} className="mr-3 text-indigo-500" />
                                                    <span className="font-medium">Book Session</span>
                                                </Link>
                                            </div>
                                            
                                            <div className="border-t border-gray-100 pt-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                                                >
                                                    <LogOut size={18} className="mr-3 group-hover:translate-x-1 transition-transform" />
                                                    <span className="font-medium">Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center space-x-3">
                            {session && (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={toggleDropdown}
                                        className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-800 rounded-full flex items-center justify-center font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm shadow-lg"
                                    >
                                        {getUserInitial()}
                                    </button>

                                    {/* Mobile User Dropdown */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                                                        {getUserInitial()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {session.user.name || 'User'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {session.user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="border-t border-gray-100 pt-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                                                >
                                                    <LogOut size={16} className="mr-3 group-hover:translate-x-1 transition-transform" />
                                                    <span className="font-medium">Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
                    {/* <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={closeMobileMenu}
                    /> */}
                    
                    {/* Floating menu */}
                    <div className="fixed top-16 right-4 left-4 z-50 lg:hidden">
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-4 duration-300">
                            <div className="p-2">
                                <Link 
                                    href="/" 
                                    className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 ${
                                        isActive('/') 
                                            ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                                    }`}
                                    onClick={closeMobileMenu}
                                >
                                    <Home size={20} className={isActive('/') ? 'text-indigo-500' : 'text-gray-400'} />
                                    <span className="font-medium">Home</span>
                                    {isActive('/') && <div className="ml-auto w-2 h-2 bg-indigo-500 rounded-full" />}
                                </Link>
                                <Link 
                                    href="/dashboard" 
                                    className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 ${
                                        isActive('/dashboard') 
                                            ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                                    }`}
                                    onClick={closeMobileMenu}
                                >
                                    <LayoutDashboard size={20} className={isActive('/dashboard') ? 'text-indigo-500' : 'text-gray-400'} />
                                    <span className="font-medium">Dashboard</span>
                                    {isActive('/dashboard') && <div className="ml-auto w-2 h-2 bg-indigo-500 rounded-full" />}
                                </Link>
                                <Link 
                                    href="/booking" 
                                    className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 ${
                                        isActive('/booking') 
                                            ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                                    }`}
                                    onClick={closeMobileMenu}
                                >
                                    <Calendar size={20} className={isActive('/booking') ? 'text-indigo-500' : 'text-gray-400'} />
                                    <span className="font-medium">Book Session</span>
                                    {isActive('/booking') && <div className="ml-auto w-2 h-2 bg-indigo-500 rounded-full" />}
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Navbar