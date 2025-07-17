'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import Login from '@/components/auth/login'
import { authClient } from '@/lib/auth-client'

interface AuthModalContextType {
  openLogin: () => void
  closeModal: () => void
}

export const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const { data: session } = authClient.useSession()
  const [showLogin, setShowLogin] = useState(false)

  const openLogin = () => {
    setShowLogin(true)
  }

  const closeModal = () => {
    setShowLogin(false)
  }
  
  useEffect(() => {
    if (session) {
      closeModal()
    }
  }, [session])

  return (
    <AuthModalContext.Provider value={{ openLogin, closeModal }}>
      {children}
      
      {showLogin && (
        <Login
          onClose={closeModal}
        />
      )}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider')
  }
  return context
} 