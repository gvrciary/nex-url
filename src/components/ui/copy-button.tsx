"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/utils";
import Button from "./button";

interface CopyButtonProps {
  textToCopy: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export default function CopyButton({
  textToCopy,
  size = "sm",
  className,
  disabled = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (disabled) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link.");
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleCopy}
      disabled={disabled}
      title={disabled ? "Deleting..." : copied ? "Copied!" : "Copy link"}
      aria-label={disabled ? "Link is being deleted" : copied ? "Link copied" : "Copy link"}
      className={cn(
        "relative overflow-hidden transition-[color,background-color,box-shadow,transform] duration-150",
        copied && "text-green-600 dark:text-green-400",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <span className="t-icon-swap" data-state={copied ? "b" : "a"}>
        <span className="t-icon flex items-center" data-icon="a">
          <Copy
            className={cn(
              size === "sm" && "h-4 w-4",
              size === "md" && "h-5 w-5",
              size === "lg" && "h-6 w-6",
            )}
          />
        </span>
        <span className="t-icon flex items-center" data-icon="b">
          <Check
            className={cn(
              size === "sm" && "h-4 w-4",
              size === "md" && "h-5 w-5",
              size === "lg" && "h-6 w-6",
            )}
          />
        </span>
      </span>

      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-md bg-green-600/10 opacity-0 transition-opacity duration-150 dark:bg-green-400/10",
          copied && "opacity-100",
        )}
      />
    </Button>
  );
}
