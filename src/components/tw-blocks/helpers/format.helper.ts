/**
 * Format the currency
 *
 * Accepts `undefined`/`null` values and gracefully falls back to 0. The
 * currency string may be empty if unknown.
 *
 * @param value - The numeric value (or undefined)
 * @param currency - The currency symbol/text
 * @returns The formatted currency
 */
export const formatCurrency = (
  value: number | undefined | null,
  currency: string
) => {
  const v = value ?? 0;
  // ensure value is numeric before calling toFixed
  const n = typeof v === "number" && !isNaN(v) ? v : 0;
  return `${currency ? currency + " " : ""}${n.toFixed(2)}`;
};

/**
 * Format the timestamp
 *
 * @param ts - The timestamp
 * @returns The formatted timestamp
 */
export function formatTimestamp(ts?: {
  _seconds: number;
  _nanoseconds: number;
}) {
  if (!ts) return "-";
  const d = new Date(ts._seconds * 1000);
  return d.toLocaleString();
}

/**
 * Format the address
 *
 * @param address - The address
 * @returns The formatted address
 */
export function formatAddress(address: string) {
  return `${address.slice(0, 10)}...${address.slice(-4)}`;
}

/**
 * Format the role
 *
 * @param role - The role
 * @returns The formatted role
 */
export function formatRole(role: string) {
  return role
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Format the text
 *
 * @param text - The text
 * @returns The formatted text
 */
export function formatText(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
