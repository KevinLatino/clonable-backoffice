"use client";

import * as React from "react";
import { useWalletValidation } from "./useWalletValidation";
import { useWallet } from "./useWallet";
import { useAddUsdcTrustline } from "./useAddUsdcTrustline";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Plus, RefreshCw, Wallet } from "lucide-react";
import { toast } from "sonner";

/**
 * Props for WalletValidationGate component
 */
export interface WalletValidationGateProps {
  /**
   * Children to render when wallet is valid
   */
  children: React.ReactNode;

  /**
   * Optional custom fallback UI when wallet is invalid
   */
  fallback?: React.ReactNode;
}

/**
 * WalletValidationGate - Reusable validation gate for Trustless Work
 *
 * @description Component that validates wallet readiness (connection, XLM funding, USDC trustline)
 * and blocks downstream actions when validation fails. Shows clear, user-friendly messages
 * explaining what is missing and why it's required.
 *
 * @example
 * ```tsx
 * <WalletValidationGate>
 *   <InitializeEscrowDialog />
 *   <FundEscrowButton />
 * </WalletValidationGate>
 * ```
 *
 * Must be used within WalletProvider context.
 */
export const WalletValidationGate: React.FC<WalletValidationGateProps> = ({
  children,
  fallback,
}) => {
  const validation = useWalletValidation();
  const { handleConnect } = useWallet();
  const { addTrustline, isLoading: isAddingTrustline } = useAddUsdcTrustline();

  const handleAddUsdcTrustline = React.useCallback(async () => {
    try {
      await addTrustline();
      toast.success("USDC trustline added successfully");
    } catch {
      toast.error("Failed to add USDC trustline. Please try again.");
    }
  }, [addTrustline]);

  // Wallet is valid - render children
  if (validation.isValid) {
    return <>{children}</>;
  }

  // Custom fallback provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Loading state
  if (validation.isLoading) {
    return (
      <Card className="p-6 border border-border bg-card">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{validation.message}</p>
        </div>
      </Card>
    );
  }

  // Invalid state - show validation message with action
  const isValidationError = validation.status === "validation_error";
  return (
    <Card className="p-6 border border-yellow-500/20 bg-yellow-500/5">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {isValidationError
                ? "Couldn't Verify Wallet"
                : "Wallet Validation Required"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {validation.message}
            </p>
          </div>
        </div>

        {validation.action && (
          <div className="flex gap-2">
            {validation.status === "disconnected" ? (
              <Button
                onClick={handleConnect}
                size="sm"
                className="gap-2 cursor-pointer"
              >
                <Wallet className="h-4 w-4" />
                {validation.action}
              </Button>
            ) : validation.status === "validation_error" && validation.retry ? (
              <Button
                onClick={validation.retry}
                size="sm"
                variant="outline"
                className="gap-2 cursor-pointer"
                disabled={validation.isLoading}
              >
                <RefreshCw className="h-4 w-4" />
                {validation.action}
              </Button>
            ) : validation.status === "inactive" ||
              validation.status === "insufficient_xlm" ? (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="gap-2 cursor-pointer"
              >
                <a
                  href="https://laboratory.stellar.org/#account-creator?network=test"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {validation.action}
                </a>
              </Button>
            ) : validation.status === "missing_usdc" ? (
              <Button
                onClick={handleAddUsdcTrustline}
                size="sm"
                variant="outline"
                className="gap-2 cursor-pointer"
                disabled={isAddingTrustline}
              >
                {isAddingTrustline ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {validation.action}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </Card>
  );
};
