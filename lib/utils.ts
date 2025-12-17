import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupBy<T>(
  array: Array<T>,
  callback: (item: T) => string | number
): Record<string | number, T[]> {
  return array.reduce((result: Record<string | number, T[]>, item: T) => {
    const key = callback(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {});
}
