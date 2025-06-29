import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image 
                  src="/assets/logo.png" 
                  alt="Book My Yoga" 
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="font-semibold text-xl">Book My Yoga</span>
            </div>
            <p className="text-gray-400">
              Transform your life with mindfulness and movement through our expert-guided yoga sessions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-yellow-400 font-semibold text-lg">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <a href="#home" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Home
              </a>
              <a href="#about" className="text-gray-300 hover:text-yellow-400 transition-colors">
                About
              </a>
              <a href="#services" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Services
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Testimonials
              </a>
              <a href="#contact" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-yellow-400 font-semibold text-lg">Newsletter</h4>
            <p className="text-gray-400">
              Subscribe to get updates on new classes and offers.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your Email"
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
              />
              <button
                type="submit"
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-r-lg hover:bg-yellow-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 Book My Yoga. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
