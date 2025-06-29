'use client'
import { SessionProvider } from "next-auth/react"
import "./globals.css";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Book My Yoga - Find Your Peace</title>
        <meta name="description" content="Join our yoga classes and transform your life with mindfulness and movement." />
      </head>
      <body>
        <SessionProvider>
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
