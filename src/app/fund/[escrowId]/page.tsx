"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useEscrowByContractIdQuery } from "@/components/tw-blocks/tanstack/useEscrowByContractIdQuery";
import { GetEscrowsFromIndexerResponse as Escrow, MultiReleaseMilestone } from "@trustless-work/escrow/types";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { EscrowSummary } from "@/components/tw-blocks/escrows/escrow-summary/EscrowSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/components/tw-blocks/helpers/format.helper";
import { FundEscrowDialog } from "@/components/tw-blocks/escrows/single-multi-release/fund-escrow/dialog/FundEscrow";
import { BalanceProgressBar } from "@/components/tw-blocks/escrows/indicators/balance-progress/bar/BalanceProgress";

export default function FundEscrowPage() {
  const params = useParams();
  const escrowId = params.escrowId as string;

  const { data: escrow, isLoading, error } = useEscrowByContractIdQuery({
    contractId: escrowId,
  });

  const { setSelectedEscrow } = useEscrowContext();

  React.useEffect(() => {
    if (escrow) {
      setSelectedEscrow(escrow);
    }
  }, [escrow, setSelectedEscrow]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading escrow...</div>
      </div>
    );
  }

  if (error || !escrow) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-destructive">
          Failed to load escrow. Please check the contract ID.
        </div>
      </div>
    );
  }

  const isMultiRelease = escrow.type === "multi-release";

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Fund Escrow</h1>
        <p className="text-muted-foreground mt-2">
          Securely fund your escrow agreement
        </p>
      </div>

      <EscrowSummary escrow={escrow} />

      {/* Milestones Breakdown */}
      {isMultiRelease && escrow.milestones && (
        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(escrow.milestones as MultiReleaseMilestone[]).map((milestone: MultiReleaseMilestone, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <p className="font-medium">{milestone.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(milestone.amount, escrow.trustline?.symbol || "")}
                    </p>
                  </div>
                  <Badge variant="outline">{milestone.status || "Pending"}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Funding Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle>Funding Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <BalanceProgressBar
            contractId={escrow.contractId}
            target={isMultiRelease
              ? escrow.milestones?.reduce((acc, milestone) => acc + (milestone as MultiReleaseMilestone).amount, 0) || 0
              : escrow.amount}
            currency={escrow.trustline?.symbol || ""}
          />
        </CardContent>
      </Card>

      {/* Fund Escrow Action */}
      <Card>
        <CardHeader>
          <CardTitle>Fund Escrow</CardTitle>
        </CardHeader>
        <CardContent>
          <FundEscrowDialog />
        </CardContent>
      </Card>
    </div>
  );
}