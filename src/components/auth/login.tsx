"use client";

import { Chrome, Github, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Button from "../ui/button";
import Card from "../ui/card";

interface LoginProps {
  onClose: () => void;
}

export default function Login({ onClose }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsLoading(true);

    try {
      if (provider === "github") {
        await authClient.signIn.social({ provider: "github" });
      } else {
        await authClient.signIn.social({ provider: "google" });
      }
      onClose();
      router.push("/dashboard");
    } catch {
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-8 relative bg-white dark:bg-black">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-light tracking-tight mb-3 text-black dark:text-white">
            Sign In
          </h2>
          <p className="text-black/70 dark:text-white/70 font-normal">
            Welcome back to Nex URL
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Button
            onClick={() => handleSocialLogin("github")}
            disabled={isLoading}
            variant="outline"
            className="w-full font-normal"
          >
            <Github size={18} className="mr-3" />
            Continue with GitHub
          </Button>

          <Button
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
            variant="outline"
            className="w-full font-normal"
          >
            <Chrome size={18} className="mr-3" />
            Continue with Google
          </Button>
        </div>
      </Card>
    </div>
  );
}
