"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GetEscrowsFromIndexerResponse as Escrow, MultiReleaseMilestone } from "@trustless-work/escrow/types";
import { formatCurrency } from "@/components/tw-blocks/helpers/format.helper";

interface EscrowSummaryProps {
  escrow: Escrow;
}

export const EscrowSummary = ({ escrow }: EscrowSummaryProps) => {
  const isMultiRelease = escrow.type === "multi-release";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Escrow Summary</span>
          <Badge variant={isMultiRelease ? "default" : "secondary"}>
            {isMultiRelease ? "Multi Release" : "Single Release"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Escrow ID
            </label>
            <p className="text-sm font-mono">{escrow.contractId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Asset
            </label>
            <p className="text-sm">
              {escrow.trustline?.symbol || "Unknown"}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Description
          </label>
          <p className="text-sm">{escrow.title || "No description"}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Total Amount
          </label>
          <p className="text-lg font-semibold">
            {isMultiRelease
              ? formatCurrency(
                  escrow.milestones?.reduce(
                    (acc, milestone) => acc + (milestone as MultiReleaseMilestone).amount,
                    0
                  ) || 0,
                  escrow.trustline?.symbol || ""
                )
              : formatCurrency(escrow.amount, escrow.trustline?.symbol || "")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};