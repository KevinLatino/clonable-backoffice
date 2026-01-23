/**
 * Trustlines | Non-Native Tokens from Stellar
 *
 * @description Trustlines are the tokens that are used to pay for the escrow
 * @description The trustlines are filtered by the network
 * @description The trustlines are filtered by the network in the trustlineOptions
 */
export const trustlines = [
  // TESTNET
  {
    symbol: "USDC",
    // Update to the new address from Trustless Work Documentation
    address: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
    network: "testnet",
  },
  {
    symbol: "EURC",
    address: "GB3Q6QDZYTHWT7E5PVS3W7FUT5GVAFC5KSZFFLPU25GO7VTC3NM2ZTVO",
    network: "testnet",
  },
  // MAINNET
  {
    symbol: "USDC",
    address: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
    network: "mainnet",
  },
  {
    symbol: "EURC",
    address: "GB3Q6QDZYTHWT7E5PVS3W7FUT5GVAFC5KSZFFLPU25GO7VTC3NM2ZTVO",
    network: "mainnet",
  },
];

// TODO: add network dynamic filter
export const trustlineOptions = Array.from(
  new Map(
    trustlines
      .filter((trustline) => trustline.network === "testnet")
      .map((trustline) => [
        trustline.address,
        { value: trustline.address, label: trustline.symbol },
      ])
  ).values()
);
