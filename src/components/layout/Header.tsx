'use client'

import { Github, Sun, Moon } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import Button from '../ui/Button'
import UserMenu from '../UserMenu'
import Login from '../auth/Login'
import Register from '../auth/Register'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const { data: session } = authClient.useSession()

  const handleShowLogin = () => {
    setShowLogin(true)
    setShowRegister(false)
  }

  const handleShowRegister = () => {
    setShowRegister(true)
    setShowLogin(false)
  }

  const handleCloseModals = () => {
    setShowLogin(false)
    setShowRegister(false)
  }

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      return newTheme
    })
  }

  return (
    <header className="border-b border-gray-200 dark:border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-sm">NX</span>
              </div>
              <span className="text-xl font-light tracking-wide text-black dark:text-white">
                Nex URL
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('https://github.com/alexisgxrcia/nex-url', '_blank')}
            >
              <Github className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {session ? (
              <UserMenu />
            ) : (
              <Button variant="outline" onClick={handleShowLogin}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {showLogin && (
        <Login
          onClose={handleCloseModals}
          onSwitchToRegister={handleShowRegister}
        />
      )}

      {showRegister && (
        <Register
          onClose={handleCloseModals}
          onSwitchToLogin={handleShowLogin}
        />
      )}
    </header>
  )
} 