'use client'

import { Github, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import Button from '@/components/ui/Button'
import UserMenu from '@/components/user-menu'
import Link from 'next/link'
import { useAuthModal } from '@/components/providers/AuthModalProvider'
import Image from 'next/image'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { data: session } = authClient.useSession()
  const { openLogin } = useAuthModal()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <Image src="/images/logo.webp" alt="Nex URL" width={32} height={32} />
              </div>
              <span className="text-xl font-light tracking-wide text-black dark:text-white">
                NexURL
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
              <Button variant="outline" onClick={openLogin}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 