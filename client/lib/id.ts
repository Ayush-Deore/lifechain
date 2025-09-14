export function makeId(prefix: string): string {
  const ts = new Date();
  return [
    prefix,
    String(ts.getFullYear()).slice(-2),
    String(ts.getMonth() + 1).padStart(2, "0"),
    String(ts.getDate()).padStart(2, "0"),
    Math.random().toString(36).slice(2, 6).toUpperCase(),
  ].join("");
}
