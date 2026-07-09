/**
 * Timestamp utility functions for MessageBubble component
 * Extracted for better maintainability and testability
 */

export interface TimestampOptions {
  locale?: string;
  showRelative?: boolean;
  relativeThresholdMs?: number;
}

const DEFAULT_OPTIONS: TimestampOptions = {
  locale: 'en-US',
  showRelative: true,
  relativeThresholdMs: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * Formats a timestamp for display in a message bubble
 * Shows relative time (e.g., "2 minutes ago") for recent messages
 * Shows absolute time for older messages
 */
export function formatMessageTimestamp(
  timestamp: Date | string | number,
  options: TimestampOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const date = normalizeToDate(timestamp);
  
  if (!isValidDate(date)) {
    return '';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (opts.showRelative && diffMs < opts.relativeThresholdMs!) {
    return formatRelativeTime(diffMs);
  }

  return formatAbsoluteTime(date, opts.locale!);
}

/**
 * Converts various timestamp formats to a Date object
 */
export function normalizeToDate(timestamp: Date | string | number): Date {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  if (typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  
  if (typeof timestamp === 'string') {
    const parsed = Date.parse(timestamp);
    return isNaN(parsed) ? new Date(NaN) : new Date(parsed);
  }
  
  return new Date(NaN);
}

/**
 * Validates if a date object is valid
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Formats time difference as relative string
 */
export function formatRelativeTime(diffMs: number): string {
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) {
    return 'Just now';
  }

  if (minutes < 60) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  }

  if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

/**
 * Formats date as absolute time string
 */
export function formatAbsoluteTime(date: Date, locale: string): string {
  const now = new Date();
  const isToday = isSameDay(date, now);
  const isYesterday = isSameDay(date, new Date(now.getTime() - 86400000));
  const isThisYear = date.getFullYear() === now.getFullYear();

  const timeStr = date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) {
    return timeStr;
  }

  if (isYesterday) {
    return `Yesterday at ${timeStr}`;
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    ...(isThisYear ? {} : { year: 'numeric' }),
  };

  const dateStr = date.toLocaleDateString(locale, dateOptions);
  return `${dateStr} at ${timeStr}`;
}

/**
 * Checks if two dates are on the same calendar day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Returns a human-readable time for message grouping
 * Used to determine if messages should be grouped together
 */
export function getMessageGroupKey(timestamp: Date | string | number): string {
  const date = normalizeToDate(timestamp);
  
  if (!isValidDate(date)) {
    return 'unknown';
  }

  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
}

/**
 * Determines if two timestamps are close enough to group messages
 * Default threshold is 5 minutes
 */
export function shouldGroupMessages(
  timestamp1: Date | string | number,
  timestamp2: Date | string | number,
  thresholdMs: number = 5 * 60 * 1000
): boolean {
  const date1 = normalizeToDate(timestamp1);
  const date2 = normalizeToDate(timestamp2);

  if (!isValidDate(date1) || !isValidDate(date2)) {
    return false;
  }

  return Math.abs(date1.getTime() - date2.getTime()) < thresholdMs;
}
