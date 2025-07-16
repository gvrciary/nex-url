"use server";

import { db } from "@/db";
import { link, user } from "@/db/schema";
import { getSession } from "./auth";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { AliasAvailabilityResult } from "@/types/link";
import { isValidUrl, validateAlias } from "@/lib/validations";

export async function createLink(originalUrl: string, customAlias?: string) {
  const session = await getSession();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  if (!originalUrl || !isValidUrl(originalUrl)) {
    throw new Error("Invalid URL");
  }

  const alias = customAlias?.trim() || nanoid(8);

  if (customAlias && customAlias.trim()) {
    const existingLink = await db
      .select()
      .from(link)
      .where(eq(link.customAlias, customAlias.trim()))
      .limit(1);

    if (existingLink.length > 0) {
      throw new Error("Alias already exists");
    }
  }

  const [newLink] = await db
    .insert(link)
    .values({
      originalUrl,
      customAlias: alias,
      userId: session.user.id,
    })
    .returning();

  revalidatePath("/dashboard");
  return newLink;
}

export async function getUserLinks() {
  const session = await getSession();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const userLinks = await db
    .select()
    .from(link)
    .where(eq(link.userId, session.user.id))
    .orderBy(desc(link.createdAt));

  return userLinks;
}

export async function deleteLink(linkId: string) {
  const session = await getSession();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const linkToDelete = await db
    .select()
    .from(link)
    .where(eq(link.id, linkId))
    .limit(1);

  if (linkToDelete.length === 0) {
    throw new Error("Link not found");
  }

  if (linkToDelete[0].userId !== session.user.id) {
    throw new Error("Not authorized");
  }

  await db.delete(link).where(eq(link.id, linkId));
  
  revalidatePath("/dashboard");
}

export async function checkAliasAvailability(alias: string): Promise<AliasAvailabilityResult> {
  const validation = validateAlias(alias);
  
  if (!validation.valid) {
    return { available: false, message: validation.message };
  }

  const existingLink = await db
    .select()
    .from(link)
    .where(eq(link.customAlias, alias.trim()))
    .limit(1);

  return { 
    available: existingLink.length === 0,
    message: existingLink.length === 0 ? "Alias is available" : "Alias is already taken"
  };
}

export async function incrementLinkClicks(alias: string) {
  const [currentLink] = await db
    .select()
    .from(link)
    .where(eq(link.customAlias, alias))
    .limit(1);

  if (!currentLink) {
    throw new Error("Link not found");
  }

  const [updatedLink] = await db
    .update(link)
    .set({ 
      clicks: currentLink.clicks + 1,
      updatedAt: new Date() 
    })
    .where(eq(link.customAlias, alias))
    .returning();

  return updatedLink;
}

export async function updateUserProfile(name: string, email: string) {
  const session = await getSession();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  if (!name.trim() || name.length < 2) {
    throw new Error("Name must be at least 2 characters");
  }

  if (!email.trim() || !email.includes('@')) {
    throw new Error("Please enter a valid email");
  }

  const [updatedUser] = await db
    .update(user)
    .set({ 
      name: name.trim(),
      email: email.trim(),
      updatedAt: new Date() 
    })
    .where(eq(user.id, session.user.id))
    .returning();

  return updatedUser;
}

export async function deleteUserAccount() {
  const session = await getSession();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  await db.delete(user).where(eq(user.id, session.user.id));
}


