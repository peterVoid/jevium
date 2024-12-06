import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  formatDate,
  formatDistanceToNow,
  formatDistanceToNowStrict,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(username: string): string {
  return username
    .toLocaleLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function getContentH1WithoutTag(content: string) {
  const matchTitle = content?.match(/<h1[^>]*>(.*?)<\/h1>/s);

  const h1Elem = matchTitle ? matchTitle[1] : "";

  const h1ElementWithoutTag = h1Elem.replace(/<\/?[^>]+(>|$)/g, "");

  return h1ElementWithoutTag;
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();

  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (from.getFullYear() === currentDate.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyyy");
    }
  }
}
