"use client";

import { X } from "lucide-react";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/utils";
import Button from "./button";

const MODAL_SIZES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = "md",
}: ModalProps) {
  const handleClose = useEffectEvent(onClose);
  const initialClosedRef = useRef(!isOpen);
  const previousIsOpenRef = useRef(isOpen);
  const [isClosed, setIsClosed] = useState(initialClosedRef.current);

  if (isOpen !== previousIsOpenRef.current) {
    previousIsOpenRef.current = isOpen;

    if (isOpen) {
      setIsClosed(false);
    }
  }

  const isRendered = isOpen || !isClosed;
  const isClosing = !isOpen && !isClosed;

  useEffect(() => {
    if (!isClosing) return;

    const closeMs =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--modal-close-dur",
        ),
      ) || 150;

    const timeoutId = window.setTimeout(() => {
      setIsClosed(true);
    }, closeMs);

    return () => window.clearTimeout(timeoutId);
  }, [isClosing]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isRendered) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isRendered]);

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="Close modal"
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-150 ease-out",
          isClosing ? "opacity-0" : "opacity-100",
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "t-modal relative w-full rounded-2xl bg-white mx-4 dark:bg-black surface-shadow",
          isClosing ? "is-closing" : "is-open",
          MODAL_SIZES[size],
          className,
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!title && (
          <div className="absolute right-4 top-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className={cn("p-6", title && "pt-4")}>{children}</div>
      </div>
    </div>
  );
}
