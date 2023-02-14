export function humanFormat(dateStr: string) {
  return Intl.DateTimeFormat("sk", {
    day: "numeric",
    weekday: "short",
    month: "long",
  }).format(new Date(dateStr));
}
