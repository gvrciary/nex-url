'use client'

import { Github } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useAuthModal } from '@/components/providers/AuthModalProvider'
import Button from '@/components/ui/Button'

export default function Hero() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const { openLogin } = useAuthModal()
  
  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard')
    } else {
      openLogin()
    }
  }

  return (
    <>
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl sm:text-7xl font-extralight tracking-tight mb-8 text-black dark:text-white">
            Shorten
            <br />
            <span className="font-light">your Links</span>
          </h1>
          
          <p className="text-xl font-light text-black/70 dark:text-white/70 mb-16 max-w-2xl mx-auto leading-relaxed">
            Transform long URLs into short and elegant links. Track clicks, analyze audience and manage your links professionally.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="px-12" onClick={handleGetStarted}>
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-12"
              onClick={() => window.open('https://github.com/alexisgxrcia/nex-url', '_blank')}
            >
              <Github className="h-4 w-4 mr-2" />
              View Repository
            </Button>
          </div>
        </div>
      </section>
    </>
  )
} 