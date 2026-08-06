export function formatDisplayDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // agar valid date nahi hai (purana manually-typed text jaise "Aug 2026"), to as-is return kar do
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}