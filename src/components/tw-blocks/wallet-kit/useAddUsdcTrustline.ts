import { useState, useCallback } from "react";
import { useWalletContext } from "./WalletProvider";
import { addUsdcTrustline } from "./addUsdcTrustline";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook to add USDC trustline to the connected wallet.
 * Invalidates wallet validation query on success.
 */
export function useAddUsdcTrustline() {
  const { walletAddress } = useWalletContext();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addTrustline = useCallback(async () => {
    if (!walletAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await addUsdcTrustline({ walletAddress });

      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: ["wallet-validation", walletAddress],
        });
      } else {
        const err =
          result.error ?? new Error("Failed to add USDC trustline");
        setError(err);
        throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, queryClient]);

  return { addTrustline, isLoading, error };
}
