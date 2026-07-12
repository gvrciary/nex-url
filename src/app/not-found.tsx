import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-5 py-16">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-black/10 dark:border-white/10" />
      <div className="relative w-full max-w-lg bg-(--background) px-6 text-center sm:px-10">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-lastik)] mb-3 text-[clamp(6rem,25vw,11rem)] font-normal leading-none tracking-[-0.06em] text-black dark:text-white">
            404
          </h1>
          <h2 className="font-[family-name:var(--font-lastik)] mb-3 text-3xl font-normal tracking-[-0.03em] text-black dark:text-white sm:text-4xl">
            Page not found
          </h2>
          <p className="mx-auto max-w-sm text-base leading-relaxed text-black/60 dark:text-white/60">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-black px-7 text-sm font-normal text-white transition-[background-color,transform] duration-150 ease-out hover:bg-black/85 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-black dark:hover:bg-white/85 dark:focus-visible:ring-white/35 dark:focus-visible:ring-offset-black"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Go Home
          </Link>
        </div>
      </div>
    </section>
  );
}
