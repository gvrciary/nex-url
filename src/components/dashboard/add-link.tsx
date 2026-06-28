"use client";

import { Check, Link, Loader2, Plus, X } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { useLinksContext } from "@/providers/links-provider";
import Button from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { checkAliasAvailability } from "@/server/actions/user";
import { appConfig } from "@/config";
import { useDebouncedCallback } from "use-debounce";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateLinkSchema } from "@/server/schemas";

interface AddLinkProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddLink({ isOpen, onClose }: AddLinkProps) {
  const { addLink } = useLinksContext();
  const [shortenedUrl, setShortenedUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aliasStatus, setAliasStatus] = useState<{
    checking: boolean;
    available: boolean;
  }>({
    checking: false,
    available: false,
  });

  const form = useForm<z.infer<typeof CreateLinkSchema>>({
    resolver: zodResolver(CreateLinkSchema),
    defaultValues: {
      url: "",
      customAlias: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateLinkSchema>) => {
    let url = `${appConfig.deployUrl}/${values.customAlias}`;
    if ((values.customAlias && !aliasStatus.available) || url === values.url)
      return;

    setIsLoading(true);
    toast.promise(addLink(values.url, values.customAlias), {
      loading: "Creating link...",
      success: (link) => {
        url = `${appConfig.deployUrl}/${link.customAlias}`;
        setShortenedUrl(url);
        form.reset();
        return "Link created successfully!";
      },
      error: (error) =>
        error instanceof Error ? error.message : "Failed to create link",
      finally: () => setIsLoading(false),
    });
  };

  const customAlias = form.watch("customAlias")?.trim() || "";
  const url = form.watch("url")?.trim() || "";

  const checkAlias = useDebouncedCallback(async () => {
    if (customAlias === "") {
      setAliasStatus({
        checking: false,
        available: false,
      });
      return;
    }

    setAliasStatus({
      checking: true,
      available: false,
    });

    toast.promise(checkAliasAvailability(customAlias), {
      loading: "Checking alias availability...",
      success: (result) => {
        setAliasStatus({
          checking: false,
          available: result.available,
        });

        if (result.available) {
          return "Alias is available!";
        } else {
          throw new Error("Alias is already taken.");
        }
      },
      error: (error) => {
        setAliasStatus({
          checking: false,
          available: false,
        });
        return error instanceof Error ? error.message : "Failed to check alias";
      },
    });
  }, 500);

  const getAliasIcon = () => {
    if (aliasStatus.checking)
      return <Loader2 className="h-4 w-4 animate-spin" />;
    if (aliasStatus.available)
      return <Check className="h-4 w-4 text-green-600 dark:text-green-400" />;
    else if (!aliasStatus.available && !aliasStatus.checking && !!customAlias)
      return <X className="h-4 w-4 text-red-600 dark:text-red-400" />;
  };

  const aliasIcon = getAliasIcon();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setShortenedUrl("");
        form.reset();
        onClose();
      }}
      size="lg"
      className="max-w-2xl"
    >
      <div className="w-full">
        <div className="t-stagger is-shown mb-6 text-center">
          <h2 className="t-stagger-line t-stagger-line--1 text-balance text-2xl font-semibold text-black dark:text-white">
            Create New Link
          </h2>
          <p className="t-stagger-line t-stagger-line--2 mt-2 text-pretty font-normal text-black/70 dark:text-white/70">
            Transform your long URL into a short and elegant link
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor=""
                className="block text-sm font-normal text-black/70 dark:text-white/70 mb-2"
              >
                URL to shorten *
              </label>
              <Input
                placeholder="https://example.com/very-long-link"
                {...form.register("url")}
                icon={<Link className="h-4 w-4" />}
              />
              <AnimatePresence initial={false}>
                {form.formState.errors.url && (
                  <m.p
                    className="mt-1 text-xs text-red-600"
                    initial={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                    transition={{ duration: 0.15 }}
                  >
                    {form.formState.errors.url.message}
                  </m.p>
                )}
              </AnimatePresence>
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
                  placeholder="my-custom-alias"
                  {...form.register("customAlias", {
                    onChange: () => checkAlias(),
                  })}
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {aliasIcon && (
                      <m.span
                        key={
                          aliasStatus.checking
                            ? "checking"
                            : aliasStatus.available
                              ? "available"
                              : "taken"
                        }
                        className="flex items-center"
                        initial={{
                          opacity: 0,
                          scale: 0.25,
                          filter: "blur(4px)",
                        }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                        transition={{
                          type: "spring",
                          duration: 0.3,
                          bounce: 0,
                        }}
                      >
                        {aliasIcon}
                      </m.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <AnimatePresence initial={false}>
                  {form.formState.errors.customAlias && (
                    <m.p
                      className="mt-1 text-xs text-red-600"
                      initial={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                      transition={{ duration: 0.15 }}
                    >
                      {form.formState.errors.customAlias.message}
                    </m.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={
                !url ||
                isLoading ||
                aliasStatus.checking ||
                (!aliasStatus.available &&
                  !aliasStatus.checking &&
                  !!customAlias)
              }
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? "Creating..." : "Create Link"}
            </Button>
          </div>
        </form>

        <AnimatePresence initial={false}>
          {shortenedUrl && (
            <m.div
              className="mt-6 border-t border-gray-200 pt-6 dark:border-white/10"
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="surface-shadow rounded-xl bg-gray-50 p-4 dark:bg-white/5">
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
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
