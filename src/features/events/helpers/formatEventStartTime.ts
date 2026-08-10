export function formatEventStartTime(startTime: string): string {
  return new Date(startTime).toLocaleString();
}
