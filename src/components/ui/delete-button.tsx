"use client";

import { Check, Trash2, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils";
import Button from "./button";

interface DeleteButtonProps {
  onDelete: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export default function DeleteButton({
  onDelete,
  size = "sm",
  className,
  disabled = false,
}: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (disabled) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onDelete();
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size={size}
          onClick={handleConfirm}
          disabled={disabled}
          title="Confirm deletion"
          aria-label="Confirm deletion"
          className={cn(
            "text-green-600 transition-[color,background-color,box-shadow,transform] duration-200 hover:bg-green-100 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-400/10 dark:hover:text-green-300",
            className,
          )}
        >
          <Check
            className={cn(
              size === "sm" && "h-4 w-4",
              size === "md" && "h-5 w-5",
              size === "lg" && "h-6 w-6",
            )}
          />
        </Button>

        <Button
          variant="ghost"
          size={size}
          onClick={handleCancel}
          disabled={disabled}
          title="Cancel"
          aria-label="Cancel deletion"
          className={cn(
            "text-red-600 transition-[color,background-color,box-shadow,transform] duration-200 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-400/10 dark:hover:text-red-300",
            className,
          )}
        >
          <X
            className={cn(
              size === "sm" && "h-4 w-4",
              size === "md" && "h-5 w-5",
              size === "lg" && "h-6 w-6",
            )}
          />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleDelete}
      disabled={disabled}
      title={disabled ? "Deleting..." : "Delete link"}
      aria-label={disabled ? "Link is being deleted" : "Delete link"}
      className={cn(
        "text-red-600 transition-[color,background-color,box-shadow,transform] duration-200 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-400/10 dark:hover:text-red-300",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <Trash2
        className={cn(
          size === "sm" && "h-4 w-4",
          size === "md" && "h-5 w-5",
          size === "lg" && "h-6 w-6",
        )}
      />
    </Button>
  );
}
