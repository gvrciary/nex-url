"use server";

import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { link } from "@/server/schemas/db";
import { isValidUrl, validateAlias } from "@/utils/validations";
import type { AliasAvailabilityResult } from "@/types/link";
import { getSession } from "./auth";
import { appConfig } from "@/config";

export async function createLink(originalUrl: string, customAlias?: string) {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  if (!originalUrl || !isValidUrl(originalUrl)) {
    throw new Error("Invalid URL");
  }

  const alias = customAlias?.trim() || nanoid(8);

  if (customAlias?.trim()) {
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
    .returning({
      id: link.id,
      originalUrl: link.originalUrl,
      customAlias: link.customAlias,
      clicks: link.clicks,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    });

  revalidatePath("/dashboard");

  return {
    ...newLink,
    url: `${appConfig.deployUrl}/${newLink.customAlias}`,
  };
}

export async function getUserLinks() {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const userLinks = await db
    .select({
      id: link.id,
      originalUrl: link.originalUrl,
      customAlias: link.customAlias,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
      clicks: link.clicks,
      url: link.customAlias,
    })
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

export async function checkAliasAvailability(
  alias: string,
): Promise<AliasAvailabilityResult> {
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
    message:
      existingLink.length === 0
        ? "Alias is available"
        : "Alias is already taken",
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
      updatedAt: new Date(),
    })
    .where(eq(link.customAlias, alias))
    .returning();

  return { status: "success", clicks: updatedLink.clicks };
}
