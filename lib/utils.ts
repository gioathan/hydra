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
