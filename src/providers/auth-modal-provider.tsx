"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import Login from "@/components/auth/login";

interface AuthModalContextType {
  openLogin: () => void;
  closeModal: () => void;
}

export const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined,
);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [showLogin, setShowLogin] = useState(false);

  const openLogin = () => {
    setShowLogin(true);
  };

  const closeModal = useCallback(() => {
    setShowLogin(false);
  }, [])

  return (
    <AuthModalContext.Provider value={{ openLogin, closeModal }}>
      {children}

      {showLogin && <Login onClose={closeModal} />}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
