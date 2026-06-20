/**
 * GescoPay Formatters
 * Utility functions for formatting currencies, dates, phone numbers, etc.
 */

export function formatCurrency(
  amount: number,
  currency: string = 'XOF',
  compact: boolean = false
): string {
  if (compact && Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M F`;
  }
  if (compact && Math.abs(amount) >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}k F`;
  }

  try {
    const formatted = new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
    return formatted;
  } catch {
    return `${amount.toLocaleString('fr-FR')} F`;
  }
}

export function formatCurrencyCompact(amount: number, currency: string = 'XOF'): string {
  return formatCurrency(amount, currency, true);
}

export function formatDate(isoString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('fr-FR', options ?? {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;

  return formatDate(isoString);
}

export function formatPhoneNumber(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 9 && clean.startsWith('7')) {
    return `+221 ${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5, 7)} ${clean.slice(7)}`;
  }
  return phone;
}

export function maskCardNumber(cardNumber: string): string {
  const parts = cardNumber.replace(/\s/g, '').match(/.{1,4}/g) ?? [];
  return parts.map((p, i) => (i < parts.length - 1 ? '••••' : p)).join(' ');
}

export function maskPhoneNumber(phone: string): string {
  if (phone.length < 4) return phone;
  return phone.slice(0, -4).replace(/\d/g, '•') + phone.slice(-4);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}G`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return value.toString();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function generateReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GP-${timestamp}-${random}`;
}
