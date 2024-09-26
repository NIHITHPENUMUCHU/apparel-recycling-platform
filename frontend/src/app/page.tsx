'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Recycle, Award, MapPin } from 'lucide-react'
import Layout from '@/components/Layout'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <Layout>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Apparel Recycling Platform</h1>
        <p className="text-xl mb-8 text-center max-w-2xl">
          Join our community in recycling and repurposing apparel. Together, we can make a difference for our planet.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center text-center">
            <Recycle className="w-16 h-16 mb-4 text-primary dark:text-primary-dark" />
            <h2 className="text-2xl font-semibold mb-2">Recycle</h2>
            <p>Give your old clothes a new life and reduce waste.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <MapPin className="w-16 h-16 mb-4 text-primary dark:text-primary-dark" />
            <h2 className="text-2xl font-semibold mb-2">Locate</h2>
            <p>Find nearby recycling centers with our interactive map.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Award className="w-16 h-16 mb-4 text-primary dark:text-primary-dark" />
            <h2 className="text-2xl font-semibold mb-2">Earn</h2>
            <p>Get rewards and badges for your eco-friendly actions.</p>
          </div>
        </div>
        {isLoggedIn ? (
          <Link href="/submit">
            <span className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">
              Submit Apparel
            </span>
          </Link>
        ) : (
          <div className="flex space-x-4">
            <Link href="/login">
              <span className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">
                Login
              </span>
            </Link>
            <Link href="/register">
              <span className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded">
                Register
              </span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}