let cachedNames: string[] | null = null;

export async function getCustomNames(): Promise<string[]> {
  if (cachedNames !== null) return cachedNames;

  try {
    const res = await fetch("/api/names");
    if (!res.ok) return [];
    cachedNames = await res.json();
    return cachedNames!;
  } catch {
    return [];
  }
}

export async function addCustomName(name: string): Promise<void> {
  try {
    const res = await fetch("/api/names", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      // Update cache
      if (cachedNames && !cachedNames.includes(name)) {
        cachedNames.push(name);
      }
    }
  } catch {
    // silent fail — name will be available next page load
  }
}
