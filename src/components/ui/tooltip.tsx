"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom";
  className?: string;
}

export default function Tooltip({
  children,
  content,
  position = "top",
  className,
}: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 640px)",
    );
    const updateEnabled = () => setEnabled(mediaQuery.matches);
    updateEnabled();
    mediaQuery.addEventListener("change", updateEnabled);

    return () => {
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
      mediaQuery.removeEventListener("change", updateEnabled);
    };
  }, []);

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setCoordinates({
      x: rect.left + rect.width / 2,
      y: position === "top" ? rect.top - 8 : rect.bottom + 8,
    });
  };

  const show = () => {
    if (!enabled) return;
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    updatePosition();
    setRendered(true);
    requestAnimationFrame(() => setVisible(true));
  };

  const hide = () => {
    if (!enabled) return;
    setVisible(false);
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => setRendered(false), 150);
  };

  useEffect(() => {
    if (!rendered) return;

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [position, rendered]);

  const translateY = position === "top" ? (visible ? 0 : 4) : visible ? 0 : -4;
  const translateBase = position === "top" ? "-100%" : "0";

  return (
    <span
      ref={triggerRef}
      className={cn("inline-flex", className)}
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {mounted && enabled && rendered &&
        createPortal(
          <span
            role="tooltip"
            className="app-tooltip pointer-events-none fixed z-[60] whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white shadow-sm transition-[opacity,transform] duration-150 ease-out dark:bg-white dark:text-black"
            style={{
              left: coordinates.x,
              top: coordinates.y,
              opacity: visible ? 1 : 0,
              transform: `translate(-50%, ${translateBase}) translateY(${translateY}px) scale(${visible ? 1 : 0.95})`,
            }}
          >
            {content}
          </span>,
          document.body,
        )}
    </span>
  );
}
