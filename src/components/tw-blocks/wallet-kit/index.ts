/**
 * Wallet Kit Block Exports
 *
 * Provides wallet management and validation for Trustless Work
 */

// Core wallet context and hooks
export { WalletProvider, useWalletContext } from "./WalletProvider";
export { useWallet } from "./useWallet";

// Wallet validation
export { useWalletValidation } from "./useWalletValidation";
export { WalletValidationGate } from "./WalletValidationGate";
export { useAddUsdcTrustline } from "./useAddUsdcTrustline";
export { addUsdcTrustline } from "./addUsdcTrustline";
export type {
  WalletValidationStatus,
  WalletValidationResult,
} from "./walletValidation.types";
export {
  HORIZON_TESTNET_URL,
  MIN_XLM_BALANCE,
  VALIDATION_MESSAGES,
} from "./walletValidation.types";

// Wallet components
export { WalletButton } from "./WalletButtons";

// Trustlines configuration
export { trustlines, trustlineOptions } from "./trustlines";

// Validators
export { isValidWallet } from "./validators";
