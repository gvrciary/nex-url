"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  use,
  useMemo,
  useState,
} from "react";
import Login from "@/components/auth/login";

interface AuthModalContextType {
  openLogin: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined,
);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [showLogin, setShowLogin] = useState(false);

  const openLogin = useCallback(() => {
    setShowLogin(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowLogin(false);
  }, []);

  const value = useMemo(
    () => ({ openLogin, closeModal }),
    [closeModal, openLogin],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}

      <Login isOpen={showLogin} onClose={closeModal} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = use(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
