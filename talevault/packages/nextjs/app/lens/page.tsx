"use client";

import React from "react";
import { ChangeProfileManagerActionType, LensClient, Wallet, development, isRelaySuccess } from "@lens-protocol/client";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

export default function Test() {
  const account = useAccount();
  let handle = "";
  let profile_id = "0x0203";
  const lensClient = new LensClient({
    environment: development,
  });
  async function getProfile() {
    handle = "ananya" + Date.now().toString();

    const profileCreateResult = await lensClient.wallet.createProfileWithHandle({
      handle: handle,
      to: account.address?.toString() || "",
    });

    console.log(profileCreateResult);
  }

  async function checkProfile() {
    const profileByHandle = await lensClient.profile.fetch({
      forHandle: `lens/${handle}`,
    });
    console.log(profileByHandle);
  }

  async function Login() {
    const { id, text } = await lensClient.authentication.generateChallenge({
      signedBy: account.address ?? "", // e.g "0xdfd7D26fd33473F475b57556118F8251464a24eb"
      for: profile_id, // e.g "0x01"
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(text);
    await lensClient.authentication.authenticate({
      id, // returned from authentication.generateChallenge
      signature,
    });
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
  }
  async function getToken() {
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      const accessTokenResult = await lensClient.authentication.getAccessToken();
      const accessToken = accessTokenResult.unwrap();
      console.log(accessToken);
    }
  }
  async function getProfileID() {
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      const profileId = await lensClient.authentication.getProfileId();
      console.log(profileId);
    }
  }
  async function isProfMngrEnabled() {
    const profile = await lensClient.profile.fetch({
      forProfileId: profile_id,
    });
    console.log(profile?.signless);
    if (profile?.signless) {
      console.log("Profile manager is enabled");
    } else {
      console.log("Profile manager is disabled");
    }
  }
  async function enableProfMngr() {
    const typedDataResult = await lensClient.profile.createChangeProfileManagersTypedData({
      approveSignless: true, // or false to disable
      // leave blank if you want to use the lens API dispatcher!
      // changeManagers: [
      //   {
      //     action: ChangeProfileManagerActionType.Add,
      //     address: "0xEEA0C1f5ab0159dba749Dc0BAee462E5e293daaF",
      //   },
      // ],
    });
    console.log(typedDataResult);
    const { id, typedData } = typedDataResult.unwrap();

    // sign with the wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signedTypedData = await signer._signTypedData(typedData.domain, typedData.types, typedData.value);

    // broadcast onchain
    const broadcastOnchainResult = await lensClient.transaction.broadcastOnchain({
      id,
      signature: signedTypedData,
    });

    const onchainRelayResult = broadcastOnchainResult.unwrap();

    if (onchainRelayResult.__typename === "RelayError") {
      console.log(`Something went wrong`);
      return;
    }

    console.log(
      `Successfully changed profile managers with transaction with id ${onchainRelayResult}, txHash: ${onchainRelayResult.txHash}`,
    );
  }
  async function followProfileID() {
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      const result = await lensClient.profile.follow({
        follow: [
          {
            profileId: "0x0203",
          },
        ],
      });
      console.log(result);
    }
  }
  async function checkFollowers() {
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      const result = await lensClient.profile.followers({
        of: "0x0203",
      });
      console.log(result);
      console.log(
        `Followers:`,
        result.items.map(p => p.handle),
      );
    }
  }
  async function createPost() {
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      // const result = await lensClient.publication.postOnchain({
      //   contentURI: "ipfs://QmZ1A9npSQvV72nYy9UJb2K42J4U7P9HXM1moW6R2L5sLG", // or arweave
      // });
      const resultTypedData = await lensClient.publication.createOnchainPostTypedData({
        contentURI: 'ipfs://QmZ1A9npSQvV72nYy9UJb2K42J4U7P9HXM1moW6R2L5sLG', // or arweave
      });
      
      const { id, typedData } = resultTypedData.unwrap();

      // sign with the wallet
      // sign with the wallet
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signedTypedData = await signer._signTypedData(typedData.domain, typedData.types, typedData.value);

      console.log(`Broadcasting signed typed data...`);

      const broadcastResult = await lensClient.transaction.broadcastOnchain({
        id,
        signature: signedTypedData,
      });

      const broadcastValue = broadcastResult.unwrap();

      if (!isRelaySuccess(broadcastValue)) {
        console.log(`Something went wrong`, broadcastValue);
        return;
      }

      console.log(`Transaction was successfully broadcasted with txId ${broadcastValue.txId}`);
    }
  }
  async function checkPublications() {
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      // lensClient.publication.fetchAll
      const result = await lensClient.publication.fetch({
        forId: '0x0203'//'9300e17e-987f-4df2-b0c9-519609f6710c'
        // forTxHash:'0x3b491c8969390b6f097a5440993b4c52c484fd2baeab887feb4038b0181b682c'
        //forId: 'ca91c8f1-4b0f-4ff6-8774-5a95c93a4551', //"0x78ba2fbd57eb339719d0af173b7709d93b9125d2d5910cf71e0ad4505901a5a9"
      });
      console.log(result);
    }
  }

  return (
    <div>
      <button className="btn" onClick={() => getProfile()}>
        Get
      </button>
      <button className="btn" onClick={() => checkProfile()}>
        Check
      </button>
      <button className="btn" onClick={() => Login()}>
        Login
      </button>
      <button className="btn" onClick={() => getToken()}>
        getToken
      </button>
      <button className="btn" onClick={() => getProfileID()}>
        getProfileID
      </button>
      <button className="btn" onClick={() => followProfileID()}>
        followProfileID
      </button>
      <button className="btn" onClick={() => isProfMngrEnabled()}>
        isProfMngrEnabled
      </button>
      <button className="btn" onClick={() => enableProfMngr()}>
        enableProfMngr
      </button>
      <button className="btn" onClick={() => checkFollowers()}>
        checkFollowers
      </button>
      <button className="btn" onClick={() => createPost()}>
        createPost
      </button>
      <button className="btn" onClick={() => checkPublications()}>
        checkPublications
      </button>
    </div>
  );
}
