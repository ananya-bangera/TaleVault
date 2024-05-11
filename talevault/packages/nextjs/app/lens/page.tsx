"use client";

import React from "react";
import { LensClient, development } from "@lens-protocol/client";
import { useAccount } from "wagmi";

export default function Test() {
  const account = useAccount();
  async function getAuthenticatedClientFromEthersWallet(): Promise<LensClient> {
    const lensClient = new LensClient({
      environment: development,
    });

    const { id, text } = await lensClient.authentication.generateChallenge({
      signedBy: account.address ?? "",
      for: "Ananya",
    });
    const signature = await wallet.signMessage(text);

    await lensClient.authentication.authenticate({ id, signature });
    console.log(lensClient.wallet);
    console.log(lensClient);
    return lensClient;
  }
  return (
    <div>
      <button onClick={() => getAuthenticatedClientFromEthersWallet()}>Check</button>
    </div>
  );
}
