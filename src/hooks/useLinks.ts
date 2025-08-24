import { useCallback, useEffect, useState } from "react";
import {
  createLink,
  deleteLink as deleteUserLink,
  getUserLinks,
} from "@/server/actions/user";
import type { LinkResponse } from "@/types/link";

export function useLinks() {
  const [links, setLinks] = useState<LinkResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const userLinks = await getUserLinks();
      setLinks(userLinks);
    } catch {
      setError("Failed to load links");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLink = useCallback(async (linkId: string) => {
    await deleteUserLink(linkId);
    setLinks((prev) => prev.filter((link) => link.id !== linkId));
  }, []);

  const addLink = useCallback(
    async (originalUrl: string, customAlias?: string) => {
      const newLink = await createLink(originalUrl, customAlias);
      setLinks((prev) => [newLink, ...prev]);
      return newLink;
    },
    [],
  );

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  return {
    links,
    loading,
    error,
    deleteLink,
    addLink,
    refetch: fetchLinks,
  };
}
