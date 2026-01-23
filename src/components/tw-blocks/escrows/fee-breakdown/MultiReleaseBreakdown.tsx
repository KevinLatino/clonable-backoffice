"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CircleDollarSign,
  Users,
  Wallet,
  Building2,
  Milestone,
  Percent,
  DollarSign,
  HelpCircle,
  Download,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { FeeRow } from "./FeeRow";
import {
  MilestoneFeeCalculation,
  FeeBreakdownSummary,
} from "./useFeeCalculations";
import { formatCurrency } from "@/components/tw-blocks/helpers/format.helper";
import { Badge } from "@/components/ui/badge";

interface MultiReleaseBreakdownProps {
  milestoneFees: MilestoneFeeCalculation[];
  summary: FeeBreakdownSummary;
  currency?: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  approved: "bg-green-100 text-green-800",
  disputed: "bg-red-100 text-red-800",
  released: "bg-purple-100 text-purple-800",
};

export const MultiReleaseBreakdown = ({
  milestoneFees,
  summary,
  currency = "",
}: MultiReleaseBreakdownProps) => {
  const [showPercentage, setShowPercentage] = useState(true);
  const [showExplainer, setShowExplainer] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={showPercentage ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2"
                onClick={() => setShowPercentage(true)}
              >
                <Percent className="h-4 w-4" />
              </Button>
              <Button
                variant={!showPercentage ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2"
                onClick={() => setShowPercentage(false)}
              >
                <DollarSign className="h-4 w-4" />
              </Button>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-9" disabled>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export to PDF (Coming soon)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-3">
          <FeeRow
            icon={CircleDollarSign}
            label="Total Escrow Amount"
            amount={formatCurrency(summary.totalAmount, currency)}
            percentage="100%"
            variant="total"
            showPercentage={showPercentage}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t">
            <div className="p-3 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Total to Receivers
                </span>
              </div>
              <span className="font-medium">
                {showPercentage
                  ? `${(100 - summary.platformFeePercent - 0.3).toFixed(1)}%`
                  : formatCurrency(
                      Number(summary.totalReceiverAmount.toFixed(2)),
                      currency,
                    )}
              </span>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Total Platform Fees
                </span>
              </div>
              <span className="font-medium">
                {showPercentage
                  ? `${summary.platformFeePercent}%`
                  : formatCurrency(
                      Number(summary.totalPlatformFees.toFixed(2)),
                      currency,
                    )}
              </span>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4 text-primary" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-muted-foreground flex items-center gap-1 cursor-help">
                      Total TW Fees
                      <Info className="h-3 w-3" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      A fixed 0.3% fee that supports Trustless Work infrastructure
                      and continued development.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="font-medium">
                {showPercentage
                  ? "0.3%"
                  : formatCurrency(
                      Number(summary.totalTrustlessWorkFees.toFixed(2)),
                      currency,
                    )}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Per-Milestone Breakdown</h3>
        <div className="space-y-4">
          {milestoneFees.map((milestone) => (
            <div
              key={milestone.milestoneIndex}
              className="p-4 bg-muted/30 rounded-lg border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Milestone className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    Milestone {milestone.milestoneIndex + 1}
                  </span>
                </div>
                <Badge
                  className={
                    statusColors[milestone.status] || statusColors.pending
                  }
                  variant="secondary"
                >
                  {milestone.status.replace("_", " ")}
                </Badge>
              </div>

              {milestone.description && (
                <p className="text-sm text-muted-foreground mb-3">
                  {milestone.description}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Milestone Amount</span>
                  <span className="font-medium">
                    {showPercentage
                      ? "100%"
                      : formatCurrency(milestone.totalAmount, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Receiver{" "}
                    {!showPercentage &&
                      `(${milestone.receiverPercent.toFixed(1)}%)`}
                  </span>
                  <span>
                    {showPercentage
                      ? `${milestone.receiverPercent.toFixed(1)}%`
                      : formatCurrency(
                          Number(milestone.receiverAmount.toFixed(2)),
                          currency,
                        )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Platform Fee{" "}
                    {!showPercentage && `(${milestone.platformFeePercent}%)`}
                  </span>
                  <span>
                    {showPercentage
                      ? `${milestone.platformFeePercent}%`
                      : formatCurrency(
                          Number(milestone.platformFeeAmount.toFixed(2)),
                          currency,
                        )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    TW Fee{" "}
                    {!showPercentage && `(${milestone.trustlessWorkPercent}%)`}
                  </span>
                  <span>
                    {showPercentage
                      ? `${milestone.trustlessWorkPercent}%`
                      : formatCurrency(
                          Number(milestone.trustlessWorkAmount.toFixed(2)),
                          currency,
                        )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <button
          onClick={() => setShowExplainer(!showExplainer)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Why do these fees exist?</span>
          </div>
          {showExplainer ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {showExplainer && (
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div>
              <h5 className="font-medium text-foreground mb-1">Platform Fee</h5>
              <p>
                Set by the platform that created this escrow. This fee compensates
                the platform for facilitating the transaction and providing their
                marketplace or service.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-foreground mb-1">
                Trustless Work Fee (0.3%)
              </h5>
              <p>
                A small, fixed fee that supports the Trustless Work protocol. This
                covers smart contract deployment and maintenance on the Stellar
                blockchain, security audits, infrastructure costs, and ongoing
                development of new features.
              </p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs">
                All fees are automatically calculated and distributed when funds
                are released from the escrow. Each milestone receiver knows exactly
                how much they will receive before starting work.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
