/**
 * Build, sign, and submit a Change Trust transaction to add USDC to a wallet
 */

import { signTransaction } from "./wallet-kit";
import { trustlines } from "./trustlines";
import { HORIZON_TESTNET_URL } from "./walletValidation.types";

const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

export interface AddUsdcTrustlineParams {
  walletAddress: string;
}

export interface AddUsdcTrustlineResult {
  success: boolean;
  txHash?: string;
  error?: Error;
}

/**
 * Builds, signs, and submits a Change Trust transaction to add the USDC trustline.
 * Uses testnet USDC issuer from trustlines config.
 */
export async function addUsdcTrustline({
  walletAddress,
}: AddUsdcTrustlineParams): Promise<AddUsdcTrustlineResult> {
  try {
    const usdcConfig = trustlines.find(
      (t) => t.symbol === "USDC" && t.network === "testnet"
    );

    if (!usdcConfig) {
      throw new Error("USDC trustline config not found for testnet");
    }

    const { Horizon, Asset, TransactionBuilder, Operation, Networks } =
      await import("@stellar/stellar-sdk");

    const server = new Horizon.Server(HORIZON_TESTNET_URL);

    // Fetch account for sequence number (AccountResponse is compatible with TransactionBuilder)
    const account = await server.loadAccount(walletAddress);

    // Fetch base fee and timebounds
    const [baseFee, timebounds] = await Promise.all([
      server.fetchBaseFee(),
      server.fetchTimebounds(60),
    ]);

    const usdcAsset = new Asset("USDC", usdcConfig.address);

    const transaction = new TransactionBuilder(account, {
      fee: baseFee.toString(),
      networkPassphrase: Networks.TESTNET,
      timebounds,
    })
      .addOperation(Operation.changeTrust({ asset: usdcAsset }))
      .build();

    const unsignedXdr = transaction.toXDR();

    const signedXdr = await signTransaction({
      unsignedTransaction: unsignedXdr,
      address: walletAddress,
    });

    const signedTransaction = TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_PASSPHRASE
    );

    const response = await server.submitTransaction(signedTransaction);

    return {
      success: true,
      txHash: response.hash,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
