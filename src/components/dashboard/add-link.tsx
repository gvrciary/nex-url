"use client";

import { Check, Link, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLinksContext } from "@/components/providers/links-provider";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import Input from "@/components/ui/input";
import { BASE_URL } from "@/constants/url";
import { checkAliasAvailability } from "@/server/actions/user";

export default function AddLink() {
  const { addLink } = useLinksContext();
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState<string>("");
  const [customAlias, setCustomAlias] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aliasChecking, setAliasChecking] = useState<boolean>(false);
  const [aliasStatus, setAliasStatus] = useState<"available" | "taken" | null>(
    null,
  );
  const [aliasMessage, setAliasMessage] = useState<string>("");

  useEffect(() => {
    if (!customAlias.trim()) {
      setAliasStatus(null);
      setAliasChecking(false);
      setAliasMessage("");
      return;
    }

    setAliasChecking(true);
    setAliasStatus(null);
    setAliasMessage("");

    const timer = setTimeout(async () => {
      try {
        const result = await checkAliasAvailability(customAlias);
        setAliasStatus(result.available ? "available" : "taken");
        setAliasMessage(result.message);
      } catch {
        setAliasStatus("taken");
        setAliasMessage("Error checking alias availability");
      } finally {
        setAliasChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [customAlias]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customAlias && aliasStatus === "taken") return;

    setIsLoading(true);

    try {
      const newLink = await addLink(url, customAlias || undefined);
      setShortenedUrl(`${BASE_URL}/${newLink.customAlias}`);
      toast.success("Link created successfully!");
      setUrl("");
      setCustomAlias("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create link",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUrl("");
    setCustomAlias("");
    setShortenedUrl("");
    setAliasStatus(null);
    setAliasChecking(false);
    setAliasMessage("");
  };

  const getAliasIcon = () => {
    if (aliasChecking) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (aliasStatus === "available")
      return <Check className="h-4 w-4 text-green-600 dark:text-green-400" />;
    if (aliasStatus === "taken")
      return <X className="h-4 w-4 text-red-600 dark:text-red-400" />;
    return null;
  };

  const getAliasMessage = () => {
    if (aliasChecking) return "Checking availability...";
    if (aliasMessage) return aliasMessage;
    return "If you don't specify an alias, one will be generated automatically";
  };

  const getAliasMessageColor = () => {
    if (aliasChecking) return "text-black/50 dark:text-white/50";
    if (aliasStatus === "available")
      return "text-green-600 dark:text-green-400";
    if (aliasStatus === "taken") return "text-red-600 dark:text-red-400";
    return "text-black/50 dark:text-white/50";
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold mb-4 text-black dark:text-white">
            Create New Link
          </h2>
          <p className="text-black/70 dark:text-white/70 font-normal">
            Transform your long URL into a short and elegant link
          </p>
        </div>

        <Card className="p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor=""
                  className="block text-sm font-normal text-black/70 dark:text-white/70 mb-2"
                >
                  URL to shorten *
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/very-long-link"
                  value={url}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (shortenedUrl.length > 0) {
                      setShortenedUrl("");
                    }

                    setUrl(value);
                  }}
                  required
                  icon={<Link className="h-4 w-4" />}
                />
              </div>

              <div>
                <label
                  htmlFor=""
                  className="block text-sm font-normal text-black/70 dark:text-white/70 mb-2"
                >
                  Custom alias (optional)
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="my-custom-link"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getAliasIcon()}
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <p className={`text-xs font-normal ${getAliasMessageColor()}`}>
                    {getAliasMessage()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={
                  !url ||
                  isLoading ||
                  aliasChecking ||
                  (customAlias.trim() !== "" && aliasStatus === "taken")
                }
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isLoading ? "Creating..." : "Create Link"}
              </Button>

              {shortenedUrl && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  New
                </Button>
              )}
            </div>
          </form>

          {shortenedUrl && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-black/70 dark:text-white/70 mb-1">
                      Your shortened link:
                    </p>
                    <p className="text-lg font-normal text-black dark:text-white break-all">
                      {shortenedUrl}
                    </p>
                  </div>
                  <div className="ml-4">
                    <CopyButton
                      textToCopy={shortenedUrl}
                      size="md"
                      className="px-4 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
