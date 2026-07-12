"use client";

import {
  Calendar,
  Download,
  ExternalLink,
  Eye,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import AddLink from "./add-link";
import LinkHistorySkeleton from "@/components/skeleton/link-history-skeleton";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import DeleteButton from "@/components/ui/delete-button";
import Input from "@/components/ui/input";
import { appConfig } from "@/config";
import { useLinksContext } from "@/providers/links-provider";
import type { LinkResponse } from "@/types/link";

interface LinkHistoryHeaderProps {
  loading: boolean;
  linksCount: number;
  isExporting: boolean;
  onAdd: () => void;
  onExport: () => void;
}

function LinkHistoryHeader({
  loading,
  linksCount,
  isExporting,
  onAdd,
  onExport,
}: LinkHistoryHeaderProps) {
  return (
    <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-[family-name:var(--font-lastik)] text-balance text-4xl font-normal tracking-[-0.04em] text-black dark:text-white sm:text-5xl">
          My links
        </h1>
        <p className="mt-2 max-w-xl text-sm text-black/55 dark:text-white/55">
          Create, review, and manage every short link in one place.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onAdd} className="min-h-11">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create link
        </Button>
        <Button
          variant="outline"
          onClick={onExport}
          disabled={loading || linksCount === 0 || isExporting}
          className="min-h-11"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </div>
    </header>
  );
}

function LinkHistoryStats({
  linksCount,
  totalClicks,
}: {
  linksCount: number;
  totalClicks: number;
}) {
  return (
    <dl className="mb-10 flex gap-12 sm:gap-20">
      {[
        ["Total links", linksCount.toLocaleString()],
        ["Total clicks", totalClicks.toLocaleString()],
      ].map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs uppercase tracking-[0.12em] text-black/45 dark:text-white/45">
            {label}
          </dt>
          <dd className="mt-1 text-2xl font-medium tabular-nums tracking-[-0.03em] text-black dark:text-white">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function LinkHistoryEmptyState({
  hasSearch,
  onAction,
}: {
  hasSearch: boolean;
  onAction: () => void;
}) {
  return (
    <div className="px-5 py-14 text-center">
      <h2 className="text-lg font-medium text-black dark:text-white">
        {hasSearch ? "No matching links" : "Create your first short link"}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-black/55 dark:text-white/55">
        {hasSearch
          ? "Try another URL or alias, or clear the search to see every link."
          : "Shorten a URL, choose an alias, and start tracking visits."}
      </p>
      {hasSearch && (
        <Button variant="outline" onClick={onAction} className="mt-5 min-h-11">
          Clear search
        </Button>
      )}
    </div>
  );
}

function LinkCard({
  link,
  isDeleting,
  onDelete,
}: {
  link: LinkResponse;
  isDeleting: boolean;
  onDelete: (linkId: string) => void;
}) {
  const shortUrl = `${appConfig.deployUrl}/${link.customAlias}`;

  return (
    <Card
      className={`group rounded-xl p-4 shadow-none transition-[border-color,opacity] hover:border-black/25 hover:shadow-none focus-within:border-black/25 dark:hover:border-white/25 dark:focus-within:border-white/25 sm:p-5 ${
        isDeleting ? "pointer-events-none opacity-50" : ""
      }`}
      aria-busy={isDeleting}
    >
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-md text-lg font-medium text-black underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-black/30 dark:text-white dark:focus:ring-white/30"
          >
            <span className="truncate">/{link.customAlias}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>
          <p className="truncate text-sm text-black/60 dark:text-white/60">
            {link.originalUrl}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-black/45 dark:text-white/45">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {new Date(link.createdAt).toLocaleDateString("en-US")}
            </span>
            <span className="flex items-center gap-1.5 tabular-nums">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              {link.clicks.toLocaleString()} {link.clicks === 1 ? "click" : "clicks"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity sm:opacity-50 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <CopyButton
            textToCopy={shortUrl}
            disabled={isDeleting}
            className="h-10 w-10 p-0"
          />
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open original URL for ${link.customAlias}`}
            title="Open original link"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-black transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:text-white dark:hover:bg-white/10 dark:focus:ring-white/20 dark:focus:ring-offset-black"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <DeleteButton
            onDelete={() => onDelete(link.id)}
            disabled={isDeleting}
            className="h-10 min-w-10 p-0"
          />
        </div>
      </div>
    </Card>
  );
}

export default function LinkHistory() {
  const { links, loading, error, deleteLink } = useLinksContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingLinks, setDeletingLinks] = useState<Set<string>>(new Set());
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportLinks = () => {
    if (loading || links.length === 0) return;

    toast.promise(
      new Promise((resolve) => {
        setIsExporting(true);
        const fullExport = {
          metadata: {
            totalLinks: links.length,
            totalClicks: links.reduce((sum, link) => sum + link.clicks, 0),
            exportedAt: new Date().toISOString(),
          },
          links: links.map((link) => ({
            originalUrl: link.originalUrl,
            shortUrl: `${appConfig.deployUrl}/${link.customAlias}`,
            alias: link.customAlias,
            clicks: link.clicks,
            createdAt: link.createdAt.toISOString(),
          })),
        };
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(fullExport, null, 2))}`;
        const linkElement = document.createElement("a");
        linkElement.href = dataUri;
        linkElement.download = `nex-url-export-${new Date().toISOString().split("T")[0]}.json`;
        linkElement.click();
        resolve("Links exported successfully!");
      }),
      {
        loading: "Exporting links...",
        success: "Links exported successfully!",
        error: "Failed to export links",
        finally: () => setIsExporting(false),
      },
    );
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredLinks = normalizedSearch
    ? links.filter(
        (link) =>
          link.originalUrl.toLowerCase().includes(normalizedSearch) ||
          link.customAlias.toLowerCase().includes(normalizedSearch),
      )
    : links;
  const totalClicks = useMemo(
    () => links.reduce((sum, link) => sum + link.clicks, 0),
    [links],
  );

  const handleDeleteLink = async (linkId: string) => {
    if (deletingLinks.has(linkId)) return;
    setDeletingLinks((previous) => new Set(previous).add(linkId));

    try {
      await toast.promise(deleteLink(linkId), {
        loading: "Deleting link...",
        success: "Link deleted successfully",
        error: "Failed to delete link",
      });
    } catch {
      // The toast reports the error; the local state is restored below.
    } finally {
      setDeletingLinks((previous) => {
        const next = new Set(previous);
        next.delete(linkId);
        return next;
      });
    }
  };

  return (
    <div className="px-4 pb-6 pt-3 sm:px-6 sm:pb-8 sm:pt-5 lg:px-8 lg:pt-6">
      <LinkHistoryHeader
        loading={loading}
        linksCount={links.length}
        isExporting={isExporting}
        onAdd={() => setIsAddLinkModalOpen(true)}
        onExport={handleExportLinks}
      />
      <LinkHistoryStats linksCount={links.length} totalClicks={totalClicks} />

      <div className="mb-6 max-w-lg">
        <label
          htmlFor="link-search"
          className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70"
        >
          Search your links
        </label>
        <Input
          id="link-search"
          type="search"
          placeholder="Search by URL or alias"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          icon={<Search className="h-4 w-4" aria-hidden="true" />}
        />
      </div>

      {loading ? (
        <LinkHistorySkeleton />
      ) : error ? (
        <div role="alert" className="rounded-xl border border-red-500/25 p-8 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : filteredLinks.length === 0 ? (
        <LinkHistoryEmptyState
          hasSearch={Boolean(normalizedSearch)}
          onAction={() =>
            normalizedSearch ? setSearchTerm("") : setIsAddLinkModalOpen(true)
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              isDeleting={deletingLinks.has(link.id)}
              onDelete={handleDeleteLink}
            />
          ))}
        </div>
      )}

      {normalizedSearch && filteredLinks.length > 0 && (
        <p role="status" aria-live="polite" className="mt-4 border-t border-black/10 pt-4 text-center text-xs text-black/45 dark:border-white/10 dark:text-white/45">
          Showing {filteredLinks.length} of {links.length} links
        </p>
      )}

      <AddLink
        isOpen={isAddLinkModalOpen}
        onClose={() => setIsAddLinkModalOpen(false)}
      />
    </div>
  );
}
