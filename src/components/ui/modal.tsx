"use client";

import { X } from "lucide-react";
import {
  useEffect,
  useEffectEvent,
  useId,
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
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  ariaLabel,
  children,
  className,
  size = "md",
}: ModalProps) {
  const handleClose = useEffectEvent(onClose);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const frameId = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frameId);
    }

    setIsVisible(false);
    if (!isRendered) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRendered(false);
      return;
    }

    const timeoutId = window.setTimeout(() => setIsRendered(false), 150);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen, isRendered]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }

      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) {
        e.preventDefault();
        dialogRef.current.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    requestAnimationFrame(() => {
      const initialFocus =
        dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
        dialogRef.current?.querySelector<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled])',
        );
      (initialFocus ?? dialogRef.current)?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isRendered) previouslyFocusedRef.current?.focus();
  }, [isRendered]);

  useEffect(() => {
    if (!isRendered) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isRendered]);

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-150 ease-out",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : (ariaLabel ?? "Dialog")}
        tabIndex={-1}
        className={cn(
          "t-modal surface-shadow relative max-h-[calc(100dvh-1rem)] w-full overflow-y-auto rounded-2xl bg-white dark:bg-black sm:max-h-[calc(100dvh-2rem)]",
          isVisible ? "is-open" : "is-closing",
          MODAL_SIZES[size],
          className,
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 id={titleId} className="text-xl font-semibold text-black dark:text-white">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close dialog"
              className="h-10 w-10 p-0"
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
              aria-label="Close dialog"
              className="h-10 w-10 p-0"
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
