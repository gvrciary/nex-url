"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Login from "@/components/auth/login";
import { authClient } from "@/auth-client";

interface AuthModalContextType {
  openLogin: () => void;
  closeModal: () => void;
}

export const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined,
);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const { data: session } = authClient.useSession();
  const [showLogin, setShowLogin] = useState(false);

  const openLogin = () => {
    setShowLogin(true);
  };

  const closeModal = useCallback(() => {
    setShowLogin(false);
  }, [])

  useEffect(() => {
    if (session) {
      closeModal();
    }
  }, [session, closeModal]);

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
