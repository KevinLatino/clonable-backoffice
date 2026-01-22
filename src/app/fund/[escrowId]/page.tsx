"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useGetMultipleEscrowBalancesQuery } from "@/components/tw-blocks/tanstack/useGetMultipleEscrowBalances";
import { useEscrowByContractIdQuery } from "@/components/tw-blocks/tanstack/useEscrowByContractIdQuery";
import { MultiReleaseMilestone } from "@trustless-work/escrow/types";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { FundEscrowHeader } from "@/components/tw-blocks/escrows/fund-escrow/FundEscrowHeader";
import { FundEscrowSidebar } from "@/components/tw-blocks/escrows/fund-escrow/FundEscrowSidebar";
import { FundEscrowMain } from "@/components/tw-blocks/escrows/fund-escrow/FundEscrowMain";
import { FundEscrowEmptyState } from "@/components/tw-blocks/escrows/fund-escrow/FundEscrowEmptyState";
import { LoadEscrowModal } from "@/components/tw-blocks/escrows/fund-escrow/LoadEscrowModal";

export default function FundEscrowPage() {
  const params = useParams();
  const escrowId = Array.isArray(params.escrowId)
    ? params.escrowId[0]
    : params.escrowId;

  const [isLoadModalOpen, setIsLoadModalOpen] = React.useState(false);

  const { data: escrowData } = useEscrowByContractIdQuery({
    contractId: escrowId,
    enabled: !!escrowId,
  });

  const { setSelectedEscrow, selectedEscrow } = useEscrowContext();

  React.useEffect(() => {
    if (
      escrowData &&
      (!selectedEscrow || selectedEscrow.contractId !== escrowData.contractId)
    ) {
      setSelectedEscrow(escrowData);
    }
  }, [escrowData, selectedEscrow, setSelectedEscrow]);

  const currentEscrow = selectedEscrow;
  const isMultiRelease = currentEscrow?.type === "multi-release";

  const { data: balanceData } = useGetMultipleEscrowBalancesQuery({
    addresses: currentEscrow?.contractId ? [currentEscrow.contractId] : [],
    enabled: !!currentEscrow?.contractId,
  });

  const targetAmount = React.useMemo(() => {
    if (!currentEscrow) return 0;

    if (isMultiRelease && currentEscrow.milestones) {
      return (currentEscrow.milestones as MultiReleaseMilestone[]).reduce(
        (sum, milestone) => sum + milestone.amount,
        0,
      );
    }

    return currentEscrow.amount || 0;
  }, [currentEscrow, isMultiRelease]);

  const isFullyFunded = React.useMemo(() => {
    if (!balanceData || !currentEscrow || targetAmount === 0) return false;
    const currentBalance = Number(balanceData?.[0]?.balance ?? 0);
    return currentBalance >= targetAmount;
  }, [balanceData, currentEscrow, targetAmount]);

  return (
    <div className="min-h-screen bg-background">
      <FundEscrowHeader />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FundEscrowSidebar
            currentEscrow={currentEscrow}
            isFullyFunded={isFullyFunded}
            onLoadModalOpen={() => setIsLoadModalOpen(true)}
            onShare={() => {
              const url = window.location.href;
              if (navigator.share) {
                navigator.share({
                  title: "Fund Escrow",
                  text: `Check out this escrow: ${currentEscrow?.contractId}`,
                  url: url,
                });
              } else {
                navigator.clipboard.writeText(url);
              }
            }}
            onView={() => {
              const url = `${window.location.origin}/escrows/${currentEscrow?.contractId}`;
              window.open(url, "_blank");
            }}
          />

          <div className="lg:col-span-2">
            {currentEscrow ? (
              <FundEscrowMain
                currentEscrow={currentEscrow}
                isMultiRelease={isMultiRelease}
                isFullyFunded={isFullyFunded}
                targetAmount={targetAmount}
              />
            ) : (
              <FundEscrowEmptyState
                onLoadEscrow={() => setIsLoadModalOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      <LoadEscrowModal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
      />
    </div>
  );
}
