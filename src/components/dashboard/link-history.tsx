"use client";

import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  type Variants,
} from "framer-motion";
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
import { useLinksContext } from "@/providers/links-provider";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import DeleteButton from "@/components/ui/delete-button";
import Input from "@/components/ui/input";
import AddLink from "./add-link";
import LinkHistorySkeleton from "@/components/skeleton/link-history-skeleton";
import { appConfig } from "@/config";
import type { LinkResponse } from "@/types/link";

const DASHBOARD_SECTION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const LINK_CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98, filter: "blur(4px)" },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      delay: index * 0.06,
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    filter: "blur(4px)",
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

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
    <m.div
      className="mb-6"
      initial="hidden"
      animate="visible"
      variants={DASHBOARD_SECTION_VARIANTS}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-black/50 dark:text-white/50">
            Dashboard
          </p>
          <h2 className="text-balance text-3xl font-medium tracking-[-0.03em] text-black dark:text-white">
            My Links
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
          <Button onClick={onExport} disabled={loading || linksCount === 0 || isExporting}>
            <Download className="h-4 w-4" />
            <span>{isExporting ? "Exporting..." : "Export"}</span>
          </Button>
        </div>
      </div>
    </m.div>
  );
}

interface LinkHistoryStatsProps {
  linksCount: number;
  totalClicks: number;
}

function LinkHistoryStats({ linksCount, totalClicks }: LinkHistoryStatsProps) {
  return (
    <m.div
      className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {[
        ["Total links", linksCount.toLocaleString()],
        ["Total clicks", totalClicks.toLocaleString()],
      ].map(([label, value]) => (
        <m.div key={label} variants={DASHBOARD_SECTION_VARIANTS}>
          <Card className="rounded-2xl p-4">
            <p className="text-sm text-black/50 dark:text-white/50">{label}</p>
            <p className="mt-1 text-2xl font-medium tabular-nums tracking-[-0.03em] text-black dark:text-white">
              {value}
            </p>
          </Card>
        </m.div>
      ))}
    </m.div>
  );
}

interface LinkHistoryEmptyStateProps {
  hasSearch: boolean;
}

function LinkHistoryEmptyState({ hasSearch }: LinkHistoryEmptyStateProps) {
  return (
    <m.div
      className="t-stagger is-shown px-4 py-12 text-center"
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {hasSearch ? (
        <>
          <p className="t-stagger-line t-stagger-line--1 text-pretty text-lg font-normal text-black/70 dark:text-white/70">
            No links found
          </p>
          <p className="t-stagger-line t-stagger-line--2 mt-2 text-pretty text-sm font-normal text-black/50 dark:text-white/50">
            Try different search terms
          </p>
        </>
      ) : (
        <>
          <p className="t-stagger-line t-stagger-line--1 text-pretty text-lg font-normal text-black/70 dark:text-white/70">
            You haven&apos;t created any links yet
          </p>
          <p className="t-stagger-line t-stagger-line--2 mt-2 text-pretty text-sm font-normal text-black/50 dark:text-white/50">
            Create your first link using the form above
          </p>
        </>
      )}
    </m.div>
  );
}

interface LinkCardProps {
  link: LinkResponse;
  index: number;
  isDeleting: boolean;
  onDelete: (linkId: string) => void;
}

function LinkCard({ link, index, isDeleting, onDelete }: LinkCardProps) {
  return (
    <m.div
      custom={index}
      layout
      variants={LINK_CARD_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card
        className={`group overflow-hidden rounded-2xl p-6 transition-opacity duration-200 hover:border-black/15 dark:hover:border-white/20 ${
          isDeleting ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <div className="mb-3 flex items-center">
              <h3 className="min-w-0 truncate text-lg font-normal text-black dark:text-white">
                /{link.customAlias}
              </h3>
            </div>

            <p className="mb-3 break-all text-sm font-normal text-black/70 dark:text-white/70 sm:text-base sm:truncate">
              {link.originalUrl}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-normal text-black/50 dark:text-white/50">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(link.createdAt).toLocaleDateString("en-US")}
              </span>
              <span className="flex items-center tabular-nums">
                <Eye className="h-4 w-4 mr-2" />
                {link.clicks.toLocaleString()} clicks
              </span>
            </div>
          </div>

          <div
            className={`flex w-full items-center justify-end space-x-2 opacity-100 transition-opacity duration-200 sm:ml-4 sm:w-auto sm:opacity-60 sm:group-hover:opacity-100 ${
              isDeleting ? "pointer-events-none opacity-30" : ""
            }`}
          >
            <CopyButton
              textToCopy={`${appConfig.deployUrl}/${link.customAlias}`}
              disabled={isDeleting}
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(link.originalUrl, "_blank")}
              disabled={isDeleting}
              title={isDeleting ? "Deleting..." : "Open original link"}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>

            <DeleteButton onDelete={() => onDelete(link.id)} disabled={isDeleting} />
          </div>
        </div>
      </Card>
    </m.div>
  );
}

interface LinkHistoryListProps {
  links: LinkResponse[];
  deletingLinks: Set<string>;
  onDelete: (linkId: string) => void;
}

function LinkHistoryList({ links, deletingLinks, onDelete }: LinkHistoryListProps) {
  return (
    <m.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnimatePresence mode="popLayout">
        {links.map((link, index) => (
          <LinkCard
            key={link.id}
            link={link}
            index={index}
            isDeleting={deletingLinks.has(link.id)}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </m.div>
  );
}

export default function LinkHistory() {
  const { links, loading, error, deleteLink } = useLinksContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deletingLinks, setDeletingLinks] = useState<Set<string>>(new Set());
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState(false);
  const handleExportLinks = () => {
    if (loading || links.length === 0) return;

    toast.promise(
      new Promise((resolve) => {
        setIsExporting(true);
        const exportData = links.map((link) => ({
          originalUrl: link.originalUrl,
          shortUrl: `${appConfig.deployUrl}/${link.customAlias}`,
          alias: link.customAlias,
          clicks: link.clicks,
          createdAt: link.createdAt.toISOString(),
        }));

        const exportStats = {
          totalLinks: links.length,
          totalClicks: links.reduce((sum, link) => sum + link.clicks, 0),
          exportedAt: new Date().toISOString(),
        };

        const fullExport = {
          metadata: exportStats,
          links: exportData,
        };

        const dataStr = JSON.stringify(fullExport, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

        const exportFileDefaultName = `nex-url-export-${new Date().toISOString().split("T")[0]}.json`;

        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
        resolve("Links exported successfully!");
      }),
      {
        loading: "Exporting links...",
        success: () => {
          setIsExporting(false);
          return "Links exported successfully!";
        },
        error: "Failed to export links",
        finally: () => setIsExporting(false),
      },
    );
  };

  const filteredLinks = useMemo(() => {
    if (!searchTerm) return links;

    return links.filter(
      (link) =>
        link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.customAlias.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [links, searchTerm]);

  const totalClicks = useMemo(
    () => links.reduce((sum, link) => sum + link.clicks, 0),
    [links],
  );

  const handleDeleteLink = async (linkId: string) => {
    setDeletingLinks((prev) => new Set([...prev, linkId]));

    toast.promise(deleteLink(linkId), {
      loading: "Deleting link...",
      success: () => {
        setDeletingLinks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(linkId);
          return newSet;
        });

        return "Link deleted successfully";
      },
      error: "Failed to delete link",
    });
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="p-4">
        <LinkHistoryHeader
          loading={loading}
          linksCount={links.length}
          isExporting={isExporting}
          onAdd={() => setIsAddLinkModalOpen(true)}
          onExport={handleExportLinks}
        />

        <LinkHistoryStats linksCount={links.length} totalClicks={totalClicks} />

        <m.div
          className="mb-6"
          initial="hidden"
          animate="visible"
          variants={DASHBOARD_SECTION_VARIANTS}
        >
          <Input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="max-w-md"
          />
        </m.div>

        <div>
          {loading ? (
            <LinkHistorySkeleton />
          ) : error ? (
            <Card className="p-12 text-center">
              <p className="text-red-600 dark:text-red-400 font-normal text-lg">
                {error}
              </p>
            </Card>
          ) : filteredLinks.length === 0 ? (
            <LinkHistoryEmptyState hasSearch={Boolean(searchTerm)} />
          ) : (
            <LinkHistoryList
              links={filteredLinks}
              deletingLinks={deletingLinks}
              onDelete={handleDeleteLink}
            />
          )}
        </div>

        {searchTerm && filteredLinks.length > 0 && (
          <div className="mt-4 text-center border-t border-gray-200 dark:border-white/10 pt-4">
            <p className="text-black/50 dark:text-white/50 font-normal text-sm">
              Showing {filteredLinks.length} of {links.length} links
            </p>
          </div>
        )}

        <AddLink
          isOpen={isAddLinkModalOpen}
          onClose={() => setIsAddLinkModalOpen(false)}
        />
      </div>
    </LazyMotion>
  );
}
