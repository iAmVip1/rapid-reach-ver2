import path from "path";

export const buildPublicPath = (absolutePath = "") => {
  if (!absolutePath) return null;
  const relativePath = path
    .relative(process.cwd(), absolutePath)
    .replace(/\\/g, "/");
  if (!relativePath) return null;
  return relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
};

export const parseArrayField = (value) => {
  if (!value && value !== "") return [];
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch (_) {
      // Not JSON, fall back to comma-separated parsing
    }
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

