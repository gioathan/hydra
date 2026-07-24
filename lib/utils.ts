import { format, parseISO } from 'date-fns';

export function formatLocalDate(utcString: string): string {
  return format(parseISO(utcString), 'EEE, d MMM yyyy');
}

export function formatLocalTime(utcString: string): string {
  return format(parseISO(utcString), 'h:mm a');
}

export function formatLocalDateTime(utcString: string): string {
  return format(parseISO(utcString), 'EEE, d MMM yyyy · h:mm a');
}

function formatHourLabel(hour: number, minute: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const mm = minute === 0 ? '' : `:${String(minute).padStart(2, '0')}`;
  return `${h12}${mm}${period}`;
}

// Formats a venue's operating hours, correctly handling overnight ranges
// (e.g. a bar open 18:00-03:00) rather than assuming close is always after open.
export function formatHourRange(
  openHour: number | null,
  closeHour: number | null,
  openMinute?: number | null,
  closeMinute?: number | null
): string | null {
  if (openHour == null || closeHour == null) return null;
  const om = openMinute ?? 0;
  const cm = closeMinute ?? 0;
  const range = `${formatHourLabel(openHour, om)} – ${formatHourLabel(closeHour, cm)}`;
  return closeHour < openHour || (closeHour === openHour && cm <= om) ? `${range} (next day)` : range;
}

export function formatDateParam(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function shortId(id: string): string {
  return id.substring(0, 8).toUpperCase();
}

export function getInitial(name: string | null | undefined): string {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
}

export function validatePassword(password: string): string | null {
  if (password.length < 10) return 'Password must be at least 10 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
  if (!/\d/.test(password)) return 'Password must contain at least one digit.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character.';
  return null;
}

export function getAxiosErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const res = (error as { response?: { status?: number; data?: { message?: string } } }).response;
    if (res?.status === 429) return 'Too many attempts. Please wait a moment and try again.';
    if (res?.data?.message) return res.data.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
