const STORAGE_KEY = "custom_names";

export function getCustomNames(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addCustomName(name: string): void {
  const names = getCustomNames();
  if (!names.includes(name)) {
    names.push(name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
  }
}
