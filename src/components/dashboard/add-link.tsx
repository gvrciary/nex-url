"use client";

import { Check, Link, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLinksContext } from "@/providers/links-provider";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
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
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-black dark:text-white">
            Create New Link
          </h2>
          <p className="text-black/70 dark:text-white/70 font-normal">
            Transform your long URL into a short and elegant link
          </p>
        </div>

        <Card className="p-6">
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
                {form.formState.errors.url && (
                  <p className="text-red-600 text-xs mt-1">
                    {form.formState.errors.url.message}
                  </p>
                )}
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
                    {getAliasIcon()}
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {form.formState.errors.customAlias && (
                    <p className="text-red-600 text-xs mt-1">
                      {form.formState.errors.customAlias.message}
                    </p>
                  )}
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
    </Modal>
  );
}
