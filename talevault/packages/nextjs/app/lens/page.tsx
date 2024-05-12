"use client";

import React from "react";
import { LensClient, Wallet, development, isRelaySuccess } from "@lens-protocol/client";
import { useAccount } from "wagmi";


export default function Test() {
  const account = useAccount();
  async function getProfile() {
    var handle = "ananya";
    const lensClient = new LensClient({
      environment: development,
      
      headers: {
        'user-agent': "spectaql",
        // userAgent: "spectaql",
      //   "Access-Control-Allow-Credentials": "true",
      //   'Access-Control-Allow-Origin': '*'
      },
    });
    const profileCreateResult = await lensClient.wallet.createProfileWithHandle({
      handle: handle,
      to: account.address?.toString() || "",
    });
    // console.log(profileCreateResult);
    // const profileCreateResultValue = profileCreateResult.unwrap();

    // if (!isRelaySuccess(profileCreateResultValue)) {
    //   console.log(`Something went wrong`, profileCreateResultValue);
    //   return;
    // }

    // console.log(
    //   `Transaction to create a new profile with handle "${handle}" was successfuly broadcasted with txId ${profileCreateResultValue.txId}`,
    // );

    // console.log(`Waiting for the transaction to be indexed...`);
    // await lensClient.transaction.waitUntilComplete({
    //   txId: profileCreateResultValue.txId,
    // });

    // const allOwnedProfiles = await lensClient.profile.fetchAll({
    //   where: {
    //     ownedBy: [account.address?.toString() || ""],
    //   },
    // });

    // console.log(
    //   `All owned profiles: `,
    //   allOwnedProfiles.items.map(i => ({ id: i.id, handle: i.handle })),
    // );

    // const newProfile = allOwnedProfiles.items.find(item => item.handle === `${handle}.test`);

    // if (newProfile) {
    //   console.log(`The newly created profile's id is: ${newProfile.id}`);
    // }
  }
  //  async function getAuthenticatedClientFromEthersWallet(wallet: Wallet): Promise<LensClient> {

  //   const lensClient = new LensClient({
  //     environment: development,
  //   });

  //   const address = await wallet.getAddress();

  //   const { id, text } = await lensClient.authentication.generateChallenge({
  //     signedBy: address,
  //     for: "",
  //   });
  //   const signature = await wallet.signMessage(text);

  //   await lensClient.authentication.authenticate({ id, signature });
  //   console.log(lensClient);

  //   return lensClient;
  // }
  return (
    <div>
      <button onClick={() => getProfile()}>Check</button>
    </div>
  );
}
