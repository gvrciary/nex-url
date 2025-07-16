'use client'

import { useState } from 'react'
import { X, Github, Chrome, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'
import { signUp } from '@/server/auth'

interface RegisterProps {
  onClose: () => void
  onSwitchToLogin: () => void
}

export default function Register({ onClose, onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      await signUp(email, password, name)
      
        onClose()
        router.push('/dashboard')
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true)
    
    try {
      if (provider === 'github') {
        await authClient.signIn.social({ provider: 'github' })
      } else {
        await authClient.signIn.social({ provider: 'google' })
      }
      onClose()
      router.push('/dashboard')
    } catch (error) {
      setErrors({ general: `${provider} login failed. Please try again.` })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-8 relative max-h-[90vh] overflow-y-auto bg-white dark:bg-black">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extralight tracking-tight mb-3 text-black dark:text-white">
            Create Account
          </h2>
          <p className="text-black/70 dark:text-white/70 font-light">
            Join Nex URL today
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
              or create with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm font-light">{errors.general}</p>
            </div>
          )}

          <div>
            <Input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2 font-light">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2 font-light">{errors.email}</p>
            )}
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-2 font-light">{errors.password}</p>
            )}
          </div>

          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2 font-light">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full font-light"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center mt-8">
          <p className="text-black/70 dark:text-white/70 font-light">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 font-light underline underline-offset-4 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </Card>
    </div>
  )
} 