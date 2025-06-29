'use client'
import { useSession } from "next-auth/react"
import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Heart, 
  Flame, 
  Moon, 
  Baby, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter,
  Send,
  Sparkles,
  Users,
  Award,
  Clock
} from "lucide-react"

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const { data: session } = useSession()
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const servicesRef = useRef(null)
  const testimonialsRef = useRef(null)
  const contactRef = useRef(null)

  const services = [
    {
      icon: Heart,
      title: "Hatha Yoga",
      description: "Traditional yoga practice focusing on physical postures and breathing techniques.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Flame,
      title: "Vinyasa Flow",
      description: "Dynamic sequence of poses synchronized with breath for a flowing practice.",
      color: "from-orange-400 to-red-500"
    },
    {
      icon: Moon,
      title: "Yin Yoga",
      description: "Slow-paced style with poses held for longer periods to target deep connective tissues.",
      color: "from-purple-400 to-indigo-500"
    },
    {
      icon: Baby,
      title: "Prenatal Yoga",
      description: "Specialized classes designed for expectant mothers to stay active and relaxed.",
      color: "from-pink-400 to-rose-500"
    }
  ]

  const testimonials = [
    {
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      name: "Sarah J.",
      text: "The instructors are amazing! I've never felt more at peace with myself.",
      rating: 5
    },
    {
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      name: "Michael T.",
      text: "Perfect for beginners. They explain everything so clearly and patiently.",
      rating: 4.5
    },
    {
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      name: "Priya K.",
      text: "The online booking system is so convenient. I can schedule my sessions anytime!",
      rating: 5
    }
  ]

  const stats = [
    { icon: Users, number: "500+", label: "Happy Students" },
    { icon: Award, number: "10+", label: "Expert Instructors" },
    { icon: Clock, number: "1000+", label: "Classes Completed" },
    { icon: Star, number: "4.9", label: "Average Rating" }
  ]

  useEffect(() => {
    // Hero Animation
    gsap.fromTo(heroRef.current?.children, 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
    )

    // About Section Animation
    gsap.fromTo(aboutRef.current?.children,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    )

    // Services Animation
    gsap.fromTo(servicesRef.current?.children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    )

    // Testimonials Animation
    gsap.fromTo(testimonialsRef.current?.children,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />)
    }
    return stars
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section 
        id="home" 
        className="min-h-screen flex items-center justify-center text-center text-white relative overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-blue-900/80 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
            alt="Yoga Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div ref={heroRef} className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-6">
              <Sparkles className="w-8 h-8 text-gray-800" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Find Your Inner Peace
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Join our yoga classes and transform your life with mindfulness and movement.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {session ? (
                <Link href="/booking">
                  <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-800 font-semibold text-lg px-8 py-6 rounded-xl transform hover:scale-105 transition-all duration-200">
                    Book Your Session
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-up">
                    <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-800 font-semibold text-lg px-8 py-6 rounded-xl transform hover:scale-105 transition-all duration-200">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="#about">
                    <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 hover:text-white text-lg px-8 py-6 rounded-xl backdrop-blur-sm">
                      Learn More
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-3 mx-auto backdrop-blur-sm">
                    <stat.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={aboutRef} className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                About Us
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the transformative power of yoga with our expert guidance
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Card className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                      Book My Yoga is dedicated to helping you achieve physical and mental well-being 
                      through the ancient practice of yoga. Our certified instructors guide you through 
                      each session with care and expertise.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Whether you're a beginner or an experienced practitioner, we have classes 
                      tailored to your needs.
                    </p>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 text-center border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
                    <CardContent className="p-0">
                      <Award className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-gray-800">Certified</div>
                      <div className="text-sm text-gray-600">Instructors</div>
                    </CardContent>
                  </Card>
                  <Card className="p-4 text-center border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                    <CardContent className="p-0">
                      <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-gray-800">Community</div>
                      <div className="text-sm text-gray-600">Focused</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1545205597-3d9d02c29597"
                    alt="Yoga Pose"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 lg:py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our diverse range of yoga practices designed for every level
            </p>
          </div>
          
          <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from our yoga community
            </p>
          </div>
          
          <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 text-center border-0 shadow-xl bg-gradient-to-br from-gray-50 to-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                  <p className="text-gray-700 italic mb-6 leading-relaxed text-lg">
                    "{testimonial.text}"
                  </p>
                  <h4 className="font-semibold text-gray-800 mb-2 text-lg">
                    {testimonial.name}
                  </h4>
                  <div className="flex justify-center space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to start your yoga journey? Get in touch with us today
            </p>
          </div>
          
          <div ref={contactRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="p-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Phone className="w-6 h-6 text-indigo-600 mr-3" />
                    Get in Touch
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg flex-shrink-0">
                        <MapPin className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                        <p className="text-gray-600">
                          22/8 bm Banerjee Rd, belghoria, Kolkata-700056
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg flex-shrink-0">
                        <Phone className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
                        <p className="text-gray-600">
                          +91 9832514346 / +91 7319398137
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg flex-shrink-0">
                        <Mail className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                        <p className="text-gray-600">
                          shyam801se@gmail.com
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Social Icons */}
                  <div className="flex space-x-4 pt-8 border-t border-gray-200 mt-8">
                    <a href="#" className="group">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                        <Facebook className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                      </div>
                    </a>
                    <a 
                      href="https://www.instagram.com/bookmy_yoga?igsh=aGN5c2s3cGx3d29l" 
                      className="group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-pink-100 hover:bg-pink-200 rounded-lg transition-colors">
                        <Instagram className="w-6 h-6 text-pink-600 group-hover:scale-110 transition-transform" />
                      </div>
                    </a>
                    <a href="#" className="group">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                        <Twitter className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="p-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Send className="w-6 h-6 text-indigo-600 mr-3" />
                  Send us a Message
                </h3>
                <form className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      className="h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your Message"
                      rows={5}
                      className="border-2 border-gray-200 focus:border-indigo-500 rounded-lg resize-none"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transform hover:scale-[1.02] transition-all duration-200"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
