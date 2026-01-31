export function formatResultCount(total: number | undefined): string {
  if (!total) return "No events";
  if (total >= 1000) return "1000+ events";
  if (total >= 100) return `${Math.floor(total / 10) * 10}+ events`;
  return `${total} events`;
}
