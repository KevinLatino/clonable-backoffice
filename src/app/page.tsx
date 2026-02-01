"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { EscrowsByRoleCards } from "@/components/tw-blocks/escrows/escrows-by-role/cards/EscrowsCards";
import { InitializeEscrowDialog } from "@/components/tw-blocks/escrows/single-release/initialize-escrow/dialog/InitializeEscrow";
import { InitializeEscrowDialog as InitializeMultiReleaseEscrowDialog } from "@/components/tw-blocks/escrows/multi-release/initialize-escrow/dialog/InitializeEscrow";
import { WalletButton } from "@/components/tw-blocks/wallet-kit/WalletButtons";
import { WalletValidationGate } from "@/components/tw-blocks/wallet-kit/WalletValidationGate";
import Image from "next/image";

const EscrowsBySignerCardsNoSSR = dynamic(
  () =>
    import(
      "@/components/tw-blocks/escrows/escrows-by-signer/cards/EscrowsCards"
    ).then((m) => m.EscrowsBySignerCards),
  {
    ssr: false,
    loading: () => null,
  }
);

import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          <Image
            src="/favicon.ico"
            alt="Trustless Work"
            width={48}
            height={48}
          />

          <h2 className="text-2xl font-bold uppercase border-l-2 border-primary pl-4">
            Backoffice
          </h2>
        </div>

        <WalletButton />
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <div className="flex w-full mb-4 justify-between items-center">
          <WalletValidationGate>
            <div className="flex gap-2">
              <InitializeEscrowDialog />
              <InitializeMultiReleaseEscrowDialog />
            </div>
          </WalletValidationGate>

          <Link
            href="/service-provider"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors font-medium"
          >
            <Briefcase className="h-4 w-4" />
            Service Provider Workspace
          </Link>
        </div>

        <Suspense fallback={null}>
          <EscrowsBySignerCardsNoSSR />
        </Suspense>
      </main>
    </div>
  );
}
