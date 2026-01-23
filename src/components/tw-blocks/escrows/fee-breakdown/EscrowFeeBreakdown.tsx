"use client";

import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { useFeeCalculations } from "./useFeeCalculations";
import { SingleReleaseBreakdown } from "./SingleReleaseBreakdown";
import { MultiReleaseBreakdown } from "./MultiReleaseBreakdown";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const EscrowFeeBreakdown = () => {
  const { selectedEscrow } = useEscrowContext();
  const { isMultiRelease, singleReleaseFees, milestoneFees, summary } =
    useFeeCalculations(selectedEscrow);

  if (!selectedEscrow) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Escrow Loaded</h3>
          <p className="text-muted-foreground max-w-sm">
            Enter an escrow contract ID above to view the fee breakdown.
          </p>
        </div>
      </Card>
    );
  }

  if (isMultiRelease && summary) {
    return (
      <MultiReleaseBreakdown
        milestoneFees={milestoneFees}
        summary={summary}
        currency={selectedEscrow.trustline?.symbol}
      />
    );
  }

  if (singleReleaseFees) {
    return (
      <SingleReleaseBreakdown
        fees={singleReleaseFees}
        currency={selectedEscrow.trustline?.symbol}
      />
    );
  }

  return null;
};
