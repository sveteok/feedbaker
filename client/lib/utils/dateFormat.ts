export function formatDate(date: Date): string {
  return new Date(date).toISOString().slice(0, 10);
}
