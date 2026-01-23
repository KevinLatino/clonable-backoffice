"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { WalletButton } from "@/components/tw-blocks/wallet-kit/WalletButtons";
import { LoadEscrowForm } from "@/components/tw-blocks/escrows/load-escrow";
import { EscrowFeeBreakdown } from "@/components/tw-blocks/escrows/fee-breakdown";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { formatAddress } from "@/components/tw-blocks/helpers/format.helper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

export default function FeesPage() {
  const { selectedEscrow, clearEscrow } = useEscrowContext();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/favicon.ico"
              alt="Trustless Work"
              width={48}
              height={48}
            />
          </Link>

          <h2 className="text-2xl font-bold uppercase border-l-2 border-primary pl-4">
            Fee Breakdown
          </h2>
        </div>

        <WalletButton />
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl">
        <Card className="p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Load Escrow</h3>
            {selectedEscrow && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {selectedEscrow.type === "multi-release"
                    ? "Multi Release"
                    : "Single Release"}
                </Badge>
                <Badge variant="secondary">
                  {formatAddress(selectedEscrow.contractId || "")}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearEscrow}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <LoadEscrowForm />
        </Card>

        <div className="w-full">
          <EscrowFeeBreakdown />
        </div>
      </main>
    </div>
  );
}
