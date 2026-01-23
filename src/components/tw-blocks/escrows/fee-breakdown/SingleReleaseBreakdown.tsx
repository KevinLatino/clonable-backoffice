"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CircleDollarSign,
  Users,
  Wallet,
  Building2,
  Percent,
  DollarSign,
  HelpCircle,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { FeeRow } from "./FeeRow";
import { FeeCalculation } from "./useFeeCalculations";
import { formatCurrency } from "@/components/tw-blocks/helpers/format.helper";

interface SingleReleaseBreakdownProps {
  fees: FeeCalculation;
  currency?: string;
}

export const SingleReleaseBreakdown = ({
  fees,
  currency = "",
}: SingleReleaseBreakdownProps) => {
  const [showPercentage, setShowPercentage] = useState(true);
  const [showExplainer, setShowExplainer] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Fee Breakdown</h3>
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
            amount={formatCurrency(fees.totalAmount, currency)}
            percentage="100%"
            variant="total"
            showPercentage={showPercentage}
          />

          <div className="border-t pt-3 space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Distribution
            </h4>

            <FeeRow
              icon={Users}
              label="Receiver"
              amount={formatCurrency(
                Number(fees.receiverAmount.toFixed(2)),
                currency,
              )}
              percentage={`${fees.receiverPercent.toFixed(1)}%`}
              variant="highlight"
              showPercentage={showPercentage}
              tooltip="The amount the service provider receives after all fees are deducted."
            />

            <FeeRow
              icon={Wallet}
              label="Platform Fee"
              amount={formatCurrency(
                Number(fees.platformFeeAmount.toFixed(2)),
                currency,
              )}
              percentage={`${fees.platformFeePercent}%`}
              showPercentage={showPercentage}
              tooltip="Fee charged by the platform that created this escrow."
            />

            <FeeRow
              icon={Building2}
              label="Trustless Work Fee"
              amount={formatCurrency(
                Number(fees.trustlessWorkAmount.toFixed(2)),
                currency,
              )}
              percentage={`${fees.trustlessWorkPercent}%`}
              showPercentage={showPercentage}
              tooltip="A fixed 0.3% fee that supports Trustless Work infrastructure, smart contract maintenance, and continued development of the escrow protocol."
            />
          </div>
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
                are released from the escrow. The receiver always knows exactly
                how much they will receive before starting work.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
