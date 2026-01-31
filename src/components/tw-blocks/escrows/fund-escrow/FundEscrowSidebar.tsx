"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, ExternalLink } from "lucide-react";
import { GetEscrowsFromIndexerResponse } from "@trustless-work/escrow/types";
import { WalletValidationGate } from "@/components/tw-blocks/wallet-kit/WalletValidationGate";

const EscrowSummaryNoSSR = dynamic(
  () =>
    import("@/components/tw-blocks/escrows/escrow-summary/EscrowSummary").then(
      (m) => m.EscrowSummary,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);

const FundEscrowDialogNoSSR = dynamic(
  () =>
    import(
      "@/components/tw-blocks/escrows/single-multi-release/fund-escrow/dialog/FundEscrow"
    ).then((m) => m.FundEscrowDialog),
  {
    ssr: false,
    loading: () => null,
  },
);

interface FundEscrowSidebarProps {
  currentEscrow: GetEscrowsFromIndexerResponse | null;
  isFullyFunded: boolean;
  onLoadModalOpen: () => void;
  onShare: () => void;
  onView: () => void;
}

export function FundEscrowSidebar({
  currentEscrow,
  isFullyFunded,
  onLoadModalOpen,
  onShare,
  onView,
}: FundEscrowSidebarProps) {
  if (!currentEscrow) {
    return (
      <Card className="border-border/60 border-dashed">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m0 0h6m-6 0h-6"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">
              No Escrow Loaded
            </p>
            <p className="text-xs text-muted-foreground">
              Load an escrow to start managing funds
            </p>
            <Button
              onClick={onLoadModalOpen}
              className="w-full mt-2"
              size="sm"
            >
              Load Escrow
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="sticky top-24 space-y-4">
      <div data-summary>
        <Suspense fallback={null}>
          <EscrowSummaryNoSSR escrow={currentEscrow} />
        </Suspense>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onShare}
            variant="outline"
            size="sm"
            className="border-border/60 hover:bg-muted/50"
            aria-label="Share escrow link"
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button
            onClick={onView}
            variant="outline"
            size="sm"
            className="border-border/60 hover:bg-muted/50"
            aria-label="View escrow details"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>

        <Button
          onClick={onLoadModalOpen}
          variant="outline"
          className="w-full border-border/60 hover:bg-muted/50"
          aria-label="Load a different escrow"
        >
          Load Different Escrow
        </Button>

        {!isFullyFunded && (
          <Suspense fallback={null}>
            <div className="w-full">
              <WalletValidationGate>
                <FundEscrowDialogNoSSR />
              </WalletValidationGate>
            </div>
          </Suspense>
        )}
      </div>
    </div>
  );
}