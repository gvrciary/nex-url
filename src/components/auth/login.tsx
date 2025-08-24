"use client";

import { Chrome, Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth-client";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";

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
    <Modal isOpen={true} onClose={onClose} size="sm" className="max-w-md">
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
    </Modal>
  );
}
