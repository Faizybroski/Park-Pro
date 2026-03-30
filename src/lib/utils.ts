import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPrice(price: number): string {
  return `£${price?.toFixed(2)}`;
}

export function formatDuration(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return "0m";

  const totalMinutes = Math.round(hours * 60);
  const days = Math.floor(totalMinutes / (24 * 60));
  const remainingMinutesAfterDays = totalMinutes % (24 * 60);
  const wholeHours = Math.floor(remainingMinutesAfterDays / 60);
  const minutes = remainingMinutesAfterDays % 60;
  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (wholeHours > 0) parts.push(`${wholeHours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

  return parts.join(" ");
}

export function getStatusLabel(status: string): string {
  return status === "active" ? "activated" : status;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "active":
    case "activated":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "completed":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// export function cn(...classes: (string | boolean | undefined | null)[]): string {
//   return classes.filter(Boolean).join(' ');
// }
