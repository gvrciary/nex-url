"use server";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { type NextRequest, NextResponse } from "next/server";
import { ROUTES } from "@/constants/route";
import { link } from "@/server/schema/schema";
import { isValidAlias } from "@/utils/validations";

const db = drizzle({
  connection: {
    url: process.env.TURSO_CONNECTION_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN || "",
  },
});

export async function handleRedirect(request: NextRequest, alias: string) {
  try {
    if (!alias || !isValidAlias(alias)) {
      return NextResponse.redirect(
        new URL(`/${ROUTES.NOT_FOUND}`, request.url),
      );
    }

    const [linkData] = await db
      .select()
      .from(link)
      .where(eq(link.customAlias, alias))
      .limit(1);

    if (!linkData) {
      return NextResponse.redirect(
        new URL(`/${ROUTES.NOT_FOUND}`, request.url),
      );
    }

    await db
      .update(link)
      .set({
        clicks: linkData.clicks + 1,
        updatedAt: new Date(),
      })
      .where(eq(link.customAlias, alias));

    return NextResponse.redirect(linkData.originalUrl);
  } catch {
    return NextResponse.redirect(new URL(`/${ROUTES.NOT_FOUND}`, request.url));
  }
}
