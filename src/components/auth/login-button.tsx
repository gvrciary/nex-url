"use client";
import { useAuthModal } from "@/providers/auth-modal-provider";
import Button from "@/components/ui/button";

export default function LoginButton() {
  const { openLogin } = useAuthModal();
  
  return (
    <Button variant="outline" onClick={openLogin}>
      Sign In
    </Button>
  );
}