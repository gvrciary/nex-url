"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};

export const signIn = async (email: string, password: string) => {
  await auth.api.signInEmail({
    body: {
      email: email,
      password: password,
    },
  });
};

export const signUp = async (email: string, password: string, name: string) => {
  await auth.api.signUpEmail({
    body: {
      name: name,
      email: email,
      password: password,
    },
  });
};
