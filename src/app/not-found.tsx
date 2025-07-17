"use client";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-extralight tracking-tight text-black dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-3xl font-extralight tracking-tight mb-4 text-black dark:text-white">
            Page Not Found
          </h2>
          <p className="text-xl font-light text-black/70 dark:text-white/70 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleGoHome} className="px-8 font-light">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
