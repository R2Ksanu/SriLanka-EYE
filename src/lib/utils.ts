import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | null | undefined, unit: 'USD' | 'LKR' = 'USD', decimals: number = 2): string {
  if (value === null || value === undefined) return 'N/A';
  if (unit === 'USD') {
    if (value >= 1) {
      return `$${value.toFixed(decimals)}B`;
    }
    return `$${(value * 1000).toFixed(0)}M`;
  } else {
    if (value >= 1000) {
      return `Rs. ${(value / 1000).toFixed(decimals)}T`;
    }
    return `Rs. ${value.toFixed(decimals)}B`;
  }
}

export function formatPerCapita(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  return `$${value.toLocaleString('en-US')}`;
}

export function formatPopulation(count: number | null | undefined): string {
  if (count === null || count === undefined) return 'N/A';
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(2)}M`;
  }
  return count.toLocaleString('en-US');
}

export function formatPercent(value: number | null | undefined, decimals: number = 1): string {
  if (value === null || value === undefined) return 'N/A';
  return `${value > 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatExchangeRate(rate: number | null | undefined): string {
  if (rate === null || rate === undefined) return 'N/A';
  return `Rs. ${rate.toFixed(2)}`;
}

export function downloadJsonFile(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCsvFile(headers: string[], rows: (string | number | null)[][], filename: string) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => (val === null || val === undefined ? '' : `"${val}"`)).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
