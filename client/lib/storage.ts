export function getList<T = any>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function addToList<T = any>(key: string, item: T): void {
  try {
    const list = getList<T>(key);
    list.push(item);
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}
