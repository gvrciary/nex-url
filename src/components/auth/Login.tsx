'use client'

import { useState } from 'react'
import { X, Github, Chrome, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'
import { signIn } from '@/server/actions/auth'

interface LoginProps {
  onClose: () => void
  onSwitchToRegister: () => void
}

export default function Login({ onClose, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
        await signIn(email, password)
        onClose()
        router.push('/dashboard')
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true)
    setError('')
    
    try {
      if (provider === 'github') {
        await authClient.signIn.social({ provider: 'github' })
      } else {
        await authClient.signIn.social({ provider: 'google' })
      }
      onClose()
      router.push('/dashboard')
    } catch {
      setError(`${provider} login failed. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-8 relative bg-white dark:bg-black">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extralight tracking-tight mb-3 text-black dark:text-white">
            Sign In
          </h2>
          <p className="text-black/70 dark:text-white/70 font-light">
            Welcome back to Nex URL
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Button
            onClick={() => handleSocialLogin('github')}
            disabled={isLoading}
            variant="outline"
            className="w-full font-light"
          >
            <Github size={18} className="mr-3" />
            Continue with GitHub
          </Button>

          <Button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            variant="outline"
            className="w-full font-light"
          >
            <Chrome size={18} className="mr-3" />
            Continue with Google
          </Button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-white/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-black text-black/50 dark:text-white/50 font-light">
              or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm font-light">{error}</p>
            </div>
          )}

          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full font-light"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center mt-8">
          <p className="text-black/70 dark:text-white/70 font-light">
            Don&apos;t have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 font-light underline underline-offset-4 transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </Card>
    </div>
  )
} 