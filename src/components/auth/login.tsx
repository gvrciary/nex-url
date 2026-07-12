"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth-client";
import { GitHub } from "@/components/assets/github";
import { Google } from "@/components/assets/google";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Login({ isOpen, onClose }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsLoading(true);

    try {
      if (provider === "github") {
        await authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" });
      } else {
        await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
      }

      onClose();
    } catch {
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Sign in"
      size="sm"
      className="max-w-md"
    >
      <div className="mb-6 text-center">
        <h2 className="font-[family-name:var(--font-lastik)] mb-2 text-3xl text-black dark:text-white">
          Sign In
        </h2>
        <p className="text-black/70 dark:text-white/70 font-normal">
          Welcome back to Nex URL
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => handleSocialLogin("github")}
          disabled={isLoading}
          variant="outline"
          className="h-11 w-full font-normal"
          data-autofocus
        >
          <GitHub className="mr-3 h-[18px] w-[18px]" />
          Continue with GitHub
        </Button>

        <Button
          onClick={() => handleSocialLogin("google")}
          disabled={isLoading}
          variant="outline"
          className="h-11 w-full font-normal"
        >
          <Google className="mr-3 h-[18px] w-[18px]" />
          Continue with Google
        </Button>
      </div>
    </Modal>
  );
}
