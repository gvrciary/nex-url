"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Link, Loader2, Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";
import Button from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { appConfig } from "@/config";
import { useLinksContext } from "@/providers/links-provider";
import { checkAliasAvailability } from "@/server/actions/user";
import { CreateLinkSchema } from "@/server/schemas";

interface AddLinkProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY_ALIAS_STATUS = {
  checking: false,
  available: false,
  message: "",
};

export default function AddLink({ isOpen, onClose }: AddLinkProps) {
  const { addLink } = useLinksContext();
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aliasStatus, setAliasStatus] = useState(EMPTY_ALIAS_STATUS);
  const aliasRequest = useRef(0);
  const submissionRequest = useRef(0);
  const form = useForm<z.infer<typeof CreateLinkSchema>>({
    resolver: zodResolver(CreateLinkSchema),
    defaultValues: { url: "", customAlias: "" },
  });

  const customAlias = form.watch("customAlias")?.trim() || "";
  const url = form.watch("url")?.trim() || "";

  const checkAlias = useDebouncedCallback(
    async (alias: string, request: number) => {
      try {
        const result = await checkAliasAvailability(alias);
        if (request !== aliasRequest.current) return;
        setAliasStatus({
          checking: false,
          available: result.available,
          message: result.available ? "Alias is available." : result.message,
        });
      } catch (error) {
        if (request !== aliasRequest.current) return;
        setAliasStatus({
          checking: false,
          available: false,
          message:
            error instanceof Error ? error.message : "Could not check this alias.",
        });
      }
    },
    500,
  );

  const reset = () => {
    aliasRequest.current += 1;
    submissionRequest.current += 1;
    checkAlias.cancel();
    setAliasStatus(EMPTY_ALIAS_STATUS);
    setShortenedUrl("");
    setIsLoading(false);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof CreateLinkSchema>) => {
    let newUrl = `${appConfig.deployUrl}/${values.customAlias}`;
    if ((values.customAlias && !aliasStatus.available) || newUrl === values.url)
      return;

    const request = ++submissionRequest.current;
    aliasRequest.current += 1;
    checkAlias.cancel();
    setIsLoading(true);
    toast.promise(addLink(values.url, values.customAlias), {
      loading: "Creating link...",
      success: (link) => {
        if (request !== submissionRequest.current) return "Link created successfully!";
        newUrl = `${appConfig.deployUrl}/${link.customAlias}`;
        setShortenedUrl(newUrl);
        setAliasStatus(EMPTY_ALIAS_STATUS);
        form.reset();
        return "Link created successfully!";
      },
      error: (error) =>
        error instanceof Error ? error.message : "Failed to create link",
      finally: () => {
        if (request === submissionRequest.current) setIsLoading(false);
      },
    });
  };

  const aliasMessageId = "custom-alias-status";
  const aliasError = form.formState.errors.customAlias;
  const urlError = form.formState.errors.url;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      size="lg"
      className="max-w-2xl"
      ariaLabel="Create a short link"
    >
      <div className="w-full">
        <div className="mb-7 pr-8">
          <h2 className="font-[family-name:var(--font-lastik)] text-balance text-3xl font-normal tracking-[-0.035em] text-black dark:text-white">
            Create a short link
          </h2>
          <p className="mt-2 text-pretty text-sm text-black/60 dark:text-white/60">
            Add a destination and optionally choose a memorable alias.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="destination-url"
              className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70"
            >
              Destination URL <span aria-hidden="true">*</span>
            </label>
            <Input
              id="destination-url"
              data-autofocus
              type="url"
              placeholder="https://example.com/very-long-link"
              {...form.register("url")}
              disabled={isLoading}
              icon={<Link className="h-4 w-4" aria-hidden="true" />}
              aria-invalid={Boolean(urlError)}
              aria-describedby={urlError ? "destination-url-error" : undefined}
            />
            {urlError && (
              <p id="destination-url-error" role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
                {urlError.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="custom-alias"
              className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70"
            >
              Custom alias <span className="font-normal text-black/45 dark:text-white/45">(optional)</span>
            </label>
            <div className="relative">
              <Input
                id="custom-alias"
                type="text"
                placeholder="my-custom-alias"
                {...form.register("customAlias", {
                  onChange: (event) => {
                    const alias = event.target.value.trim();
                    const request = ++aliasRequest.current;
                    checkAlias.cancel();
                    if (!alias) {
                      setAliasStatus(EMPTY_ALIAS_STATUS);
                      return;
                    }
                    setAliasStatus({
                      checking: true,
                      available: false,
                      message: "Checking availability...",
                    });
                    checkAlias(alias, request);
                  },
                })}
                disabled={isLoading}
                className="pr-10"
                aria-invalid={Boolean(aliasError) || (Boolean(customAlias) && !aliasStatus.checking && !aliasStatus.available)}
                aria-describedby={aliasError ? "custom-alias-error" : aliasStatus.message ? aliasMessageId : undefined}
              />
              {customAlias && (
                <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center" aria-hidden="true">
                  {aliasStatus.checking ? (
                    <Loader2 className="h-4 w-4 animate-spin text-black/45 dark:text-white/45" />
                  ) : aliasStatus.available ? (
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                </span>
              )}
            </div>
            {aliasError ? (
              <p id="custom-alias-error" role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
                {aliasError.message}
              </p>
            ) : aliasStatus.message ? (
              <p
                id={aliasMessageId}
                role="status"
                className={`mt-2 text-xs ${
                  aliasStatus.checking
                    ? "text-black/50 dark:text-white/50"
                    : aliasStatus.available
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                }`}
              >
                {aliasStatus.message}
              </p>
            ) : (
              <p className="mt-2 text-xs text-black/45 dark:text-white/45">
                Letters, numbers, hyphens, and underscores only.
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={
              !url ||
              isLoading ||
              aliasStatus.checking ||
              (!aliasStatus.available && Boolean(customAlias))
            }
            className="min-h-11 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isLoading ? "Creating..." : "Create link"}
          </Button>
        </form>

        {shortenedUrl && (
          <div className="mt-7 border-t border-black/10 pt-6 dark:border-white/10">
            <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <p className="text-xs uppercase tracking-[0.1em] text-black/45 dark:text-white/45">
                Short link created
              </p>
              <div className="mt-2 flex items-center gap-3">
                <a
                  href={shortenedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 break-all text-sm font-medium text-black underline-offset-4 hover:underline dark:text-white"
                >
                  {shortenedUrl}
                </a>
                <CopyButton textToCopy={shortenedUrl} size="md" className="h-10 w-10 shrink-0 p-0" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
