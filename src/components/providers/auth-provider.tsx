'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import Login from '@/components/auth/LoginT'
import Register from '@/components/auth/RegisterT'
import { authClient } from '@/lib/auth-client'

interface AuthModalContextType {
  openLogin: () => void
  openRegister: () => void
  closeModal: () => void
}

export const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const { data: session } = authClient.useSession()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const openLogin = () => {
    setShowLogin(true)
    setShowRegister(false)
  }

  const openRegister = () => {
    setShowRegister(true)
    setShowLogin(false)
  }

  const closeModal = () => {
    setShowLogin(false)
    setShowRegister(false)
  }
  
  useEffect(() => {
    if (session) {
      closeModal()
    }
  }, [session])

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister, closeModal }}>
      {children}
      
      {showLogin && (
        <Login
          onClose={closeModal}
          onSwitchToRegister={openRegister}
        />
      )}

      {showRegister && (
        <Register
          onClose={closeModal}
          onSwitchToLogin={openLogin}
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