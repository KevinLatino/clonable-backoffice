import { useQuery } from "@tanstack/react-query";
import { useWalletContext } from "./WalletProvider";
import { trustlines } from "./trustlines";
import {
  WalletValidationResult,
  HORIZON_TESTNET_URL,
  MIN_XLM_BALANCE,
  VALIDATION_MESSAGES,
} from "./walletValidation.types";

/**
 * Fetch account data from Stellar Horizon
 */
async function fetchAccountData(walletAddress: string) {
  // Dynamically import @stellar/stellar-sdk to avoid SSR issues
  // In v14+, Horizon Server is under the Horizon namespace
  const { Horizon } = await import("@stellar/stellar-sdk");
  const server = new Horizon.Server(HORIZON_TESTNET_URL);

  try {
    const account = await server.accounts().accountId(walletAddress).call();
    return account;
  } catch (error: unknown) {
    // Check if it's a 404 error (account not found/funded)
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      "status" in error.response &&
      error.response.status === 404
    ) {
      return null; // Account not funded
    }
    throw error;
  }
}

/**
 * Validate wallet readiness for Trustless Work
 *
 * @description Hook that validates wallet connection, XLM funding, and USDC trustline.
 * Uses Wallet Kit context as the single source of truth.
 *
 * @returns WalletValidationResult with status, message, and validation state
 */
export function useWalletValidation(): WalletValidationResult {
  const { walletAddress } = useWalletContext();

  // Get USDC issuer for testnet
  const usdcIssuer = trustlines.find(
    (t) => t.symbol === "USDC" && t.network === "testnet"
  )?.address;

  const query = useQuery({
    queryKey: ["wallet-validation", walletAddress],
    queryFn: async (): Promise<WalletValidationResult> => {
      if (!walletAddress) {
        return {
          status: "disconnected",
          isValid: false,
          message: VALIDATION_MESSAGES.disconnected.message,
          action: VALIDATION_MESSAGES.disconnected.action,
        };
      }

      // Fetch account from Horizon
      const account = await fetchAccountData(walletAddress);

      // Account not found (not funded/activated)
      if (!account) {
        return {
          status: "inactive",
          isValid: false,
          message: VALIDATION_MESSAGES.inactive.message,
          action: VALIDATION_MESSAGES.inactive.action,
        };
      }

      // Parse balances
      const balances = account.balances || [];

      // Check XLM balance (native asset)
      const xlmBalance = balances.find(
        (b: { asset_type: string }) => b.asset_type === "native"
      );

      if (!xlmBalance || parseFloat(xlmBalance.balance) < MIN_XLM_BALANCE) {
        return {
          status: "insufficient_xlm",
          isValid: false,
          message: VALIDATION_MESSAGES.insufficient_xlm.message,
          action: VALIDATION_MESSAGES.insufficient_xlm.action,
        };
      }

      // Check USDC trustline
      const usdcBalance = balances.find(
        (b: { asset_type: string; asset_code?: string; asset_issuer?: string }) =>
          b.asset_type !== "native" &&
          b.asset_code === "USDC" &&
          b.asset_issuer === usdcIssuer
      );

      if (!usdcBalance) {
        return {
          status: "missing_usdc",
          isValid: false,
          message: VALIDATION_MESSAGES.missing_usdc.message,
          action: VALIDATION_MESSAGES.missing_usdc.action,
        };
      }

      // Wallet is fully valid
      return {
        status: "valid",
        isValid: true,
        message: "Your wallet is ready to use.",
      };
    },
    enabled: !!walletAddress, // Only run if wallet is connected
    staleTime: 30000, // Cache for 30 seconds
    retry: 1, // Retry once on failure
  });

  // Handle loading and error states
  if (!walletAddress) {
    return {
      status: "disconnected",
      isValid: false,
      message: VALIDATION_MESSAGES.disconnected.message,
      action: VALIDATION_MESSAGES.disconnected.action,
      isLoading: false,
    };
  }

  if (query.isLoading) {
    return {
      status: "disconnected",
      isValid: false,
      message: "Validating wallet...",
      isLoading: true,
    };
  }

  if (query.error) {
    return {
      status: "validation_error",
      isValid: false,
      message: VALIDATION_MESSAGES.validation_error.message,
      action: VALIDATION_MESSAGES.validation_error.action,
      error: query.error as Error,
      isLoading: false,
      retry: () => query.refetch(),
    };
  }

  return query.data || {
    status: "disconnected",
    isValid: false,
    message: VALIDATION_MESSAGES.disconnected.message,
    action: VALIDATION_MESSAGES.disconnected.action,
    isLoading: false,
  };
}
