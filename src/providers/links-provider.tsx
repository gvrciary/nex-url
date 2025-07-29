"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useLinks } from "@/hooks/useLinks";
import type { Link } from "@/types/link";

interface LinksContextType {
  links: Link[];
  loading: boolean;
  error: string;
  deleteLink: (linkId: string) => Promise<void>;
  addLink: (originalUrl: string, customAlias?: string) => Promise<Link>;
  refetch: () => Promise<void>;
}

const LinksContext = createContext<LinksContextType | undefined>(undefined);

interface LinksProviderProps {
  children: ReactNode;
}

export function LinksProvider({ children }: LinksProviderProps) {
  const linksData = useLinks();

  return (
    <LinksContext.Provider value={linksData}>{children}</LinksContext.Provider>
  );
}

export function useLinksContext() {
  const context = useContext(LinksContext);
  if (context === undefined) {
    throw new Error("useLinksContext must be used within a LinksProvider");
  }
  return context;
}
