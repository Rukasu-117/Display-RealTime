export const DEFAULT_ADMIN_REDIRECT = "/admin/displays";

export function getSafeCallbackUrl(value?: string | null) {
  if (!value) return DEFAULT_ADMIN_REDIRECT;
  if (!value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_ADMIN_REDIRECT;
  }
  return value;
}
