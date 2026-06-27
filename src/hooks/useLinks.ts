import { useCallback, useState } from "react";
import {
  createLink,
  deleteLink as deleteUserLink,
  getUserLinks,
} from "@/server/actions/user";
import type { LinkResponse } from "@/types/link";

export function useLinks(initialLinks: LinkResponse[]) {
  const [links, setLinks] = useState<LinkResponse[]>(initialLinks);

  const fetchLinks = useCallback(async () => {
    const userLinks = await getUserLinks();
    setLinks(userLinks);
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

  return {
    links,
    loading: false,
    error: "",
    deleteLink,
    addLink,
    refetch: fetchLinks,
  };
}
