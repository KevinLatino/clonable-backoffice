/**
 * Wallet validation types and constants
 */

/**
 * Status of wallet validation
 */
export type WalletValidationStatus =
  | "disconnected" // No wallet connected
  | "inactive" // Wallet not funded/activated on Stellar
  | "insufficient_xlm" // Wallet has XLM but below minimum threshold
  | "missing_usdc" // Wallet missing USDC trustline
  | "validation_error" // Technical error - couldn't verify wallet (network, API, etc.)
  | "valid"; // Wallet is fully ready

/**
 * Result of wallet validation
 */
export type WalletValidationResult = {
  status: WalletValidationStatus;
  isValid: boolean;
  message: string;
  action?: string;
  isLoading?: boolean;
  error?: Error;
  /** Call to retry validation (e.g. when validation_error due to network) */
  retry?: () => void;
};

/**
 * Constants for wallet validation
 */

// Horizon API URL for testnet
export const HORIZON_TESTNET_URL = "https://horizon-testnet.stellar.org";

// Minimum XLM balance required (base reserve + 1 trustline: 2 + 1 = 3 entries × 0.5 = 1.5 XLM)
export const MIN_XLM_BALANCE = 1.5;

/**
 * User-friendly validation messages
 */
export const VALIDATION_MESSAGES: Record<
  Exclude<WalletValidationStatus, "valid">,
  { message: string; action: string }
> = {
  disconnected: {
    message:
      "Connect your wallet to continue. You need a Stellar wallet to use escrow and payment features.",
    action: "Connect Wallet",
  },
  inactive: {
    message:
      "Your wallet is not yet active on Stellar. You need a small amount of XLM to activate your account. Get test XLM from a Stellar faucet.",
    action: "Get XLM",
  },
  insufficient_xlm: {
    message:
      "Your wallet needs more XLM to pay transaction fees. Keep at least 1.5 XLM in your wallet for fees. Get test XLM from a Stellar faucet.",
    action: "Get XLM",
  },
  missing_usdc: {
    message:
      "Your wallet does not have USDC enabled. Add a USDC trustline to send and receive payments.",
    action: "Add USDC Trustline",
  },
  validation_error: {
    message:
      "We couldn't verify your wallet status. Your wallet may be correctly configured (connected, with XLM and USDC), but a technical check failed. This can happen due to network issues, the Stellar API being temporarily unavailable, or connection problems. Please try again.",
    action: "Try Again",
  },
};
