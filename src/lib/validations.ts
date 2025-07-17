import { ROUTES } from "@/constants/route";

export function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidAlias(alias: string): boolean {
  return /^[a-zA-Z0-9-_]+$/.test(alias);
}

export function validateAlias(alias: string): { valid: boolean; message: string } {
  if (!alias.trim()) {
    return { valid: false, message: "Alias cannot be empty" };
  }

  if (alias.length < 1) {
    return { valid: false, message: "Alias must be at least 1 character" };
  }

  if (alias.length > 50) {
    return { valid: false, message: "Alias cannot exceed 50 characters" };
  }

  if (!isValidAlias(alias)) {
    return { valid: false, message: "Alias can only contain letters, numbers, hyphens, and underscores" };
  }

  if (alias.startsWith(ROUTES.API) || alias.startsWith(ROUTES.NOT_FOUND) || alias.startsWith(ROUTES.DASHBOARD) || alias.startsWith(ROUTES.SETTINGS)) {
    return { valid: false, message: "Alias cannot start with /api, /not-found, /dashboard, or /settings" };
  }

  return { valid: true, message: "Valid alias" };
}

export function validateUrl(url: string): { valid: boolean; message: string } {
  if (!url.trim()) {
    return { valid: false, message: "URL cannot be empty" };
  }

  if (!isValidUrl(url)) {
    return { valid: false, message: "Please enter a valid URL" };
  }

  return { valid: true, message: "Valid URL" };
} 