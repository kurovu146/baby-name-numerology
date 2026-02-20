export interface Favorite {
  fullName: string;
  birthDate: string;
  score: number;
  level: string;
  savedAt: number;
}

export function getFavorites(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("baby-name-favorites") || "[]");
  } catch { return []; }
}

export function saveFavorite(fav: Favorite): void {
  const list = getFavorites();
  if (list.some((f) => f.fullName === fav.fullName && f.birthDate === fav.birthDate)) return;
  list.push(fav);
  localStorage.setItem("baby-name-favorites", JSON.stringify(list));
}

export function removeFavorite(fullName: string, birthDate: string): void {
  const list = getFavorites().filter((f) => !(f.fullName === fullName && f.birthDate === birthDate));
  localStorage.setItem("baby-name-favorites", JSON.stringify(list));
}

export function isFavorited(fullName: string, birthDate: string): boolean {
  return getFavorites().some((f) => f.fullName === fullName && f.birthDate === birthDate);
}
