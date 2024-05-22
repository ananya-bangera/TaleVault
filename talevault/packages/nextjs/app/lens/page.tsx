"use client";

import React, { useState } from "react";
import Login from "./_components/Login";

import { ChangeProfileManagerActionType, LensClient, Wallet, development, isRelaySuccess } from "@lens-protocol/client";
import { LinkMetadata, MediaImageMimeType, image, link } from "@lens-protocol/metadata";
import { ethers } from "ethers";
import { encode } from "punycode";
import { v4 as uuidv4 } from "uuid";
import { useAccount } from "wagmi";
import { setEnvironmentData } from "worker_threads";
import Profile from "./[handle]/page";

export default function Test() {
  const account = useAccount();
  let handle = localStorage.getItem("handle");
  let profile_id = "0x025a";
  const [isauthdone, setisauthdone] = useState(false);
  const lensClient = new LensClient({
    environment: development,
  });

  let pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  let pinataApiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
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

  async function LoginAccount() {
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
  async function pinMetadataToPinata(metadata: any, contentName: any, pinataApiKey: any, pinataApiSecret: any) {
    console.log("pinning metadata to pinata...");
    const data = JSON.stringify({
      pinataMetadata: { name: contentName },
      pinataContent: metadata,
    });
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataApiSecret,
      },
      body: data,
    };
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", config);
    const ipfsHash = (await response.json()).IpfsHash;
    console.log(`Stored content metadata with ${ipfsHash}`);
    return ipfsHash;
  }
  const createContentMetadata = function (content: any, contentName: any, imageUri: any, imageType: any) {
    return {
      version: "2.0.0",
      metadata_id: uuidv4(),
      description: "Created from LensBlog",
      content: content,
      name: contentName,
      mainContentFocus: "ARTICLE",
      attributes: [],
      locale: "en-US",
      appId: "lensblog",
      video: imageUri,
      imageMimeType: imageType,
      tags: ["tag1", "tag2", "tag3"],
    };
  };
  async function getContentURI(content: any, contentName: any, imageUri: any, imageType: any) {
    let fullContentURI = "";

    const contentMetadata = createContentMetadata(content, contentName, imageUri, imageType);

    const BASE_64_PREFIX = "data:application/json;base64,";
    if (pinataApiSecret && pinataApiKey) {
      const metadataIpfsHash = await pinMetadataToPinata(contentMetadata, contentName, pinataApiKey, pinataApiSecret);
      fullContentURI = `ipfs://${metadataIpfsHash}`;
      console.log(fullContentURI);
    } else {
      const base64EncodedContent = encode(JSON.stringify(contentMetadata));
      const fullContentURI = BASE_64_PREFIX + base64EncodedContent;
    }
    return fullContentURI;
  }
  async function createPost() {
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      var content = "content Ananya";
      var contentName = "contentName Ananya";
      var imageUri = "ipfs://QmZ1A9npSQvV72nYy9UJb2K42J4U7P9HXM1moW6R2L5sLG";
      var imageType = "video/mpv4";
      var fullContentURI = await getContentURI(content, contentName, imageUri, imageType);

      const result = await lensClient.publication.postOnchain({
        contentURI: fullContentURI, // or arweave
      });
      console.log(result);
      const resultValue = result.unwrap();

      if (!isRelaySuccess(resultValue)) {
        console.log(`Something went wrong`, resultValue);
        return;
      }
      console.log(`Transaction was successfully broadcasted with txId ${resultValue.txId}`);
    }
  }
  async function checkPublications() {
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      // lensClient.publication.fetchAll
      const result = await lensClient.publication.fetchAll({
        // forId: '0x0203'//'9300e17e-987f-4df2-b0c9-519609f6710c'
        // forTxHash: "0xa552309a7f75258aeab723d441d0e5bc771eef2dcc3e0e9ce802c3b3d942dabc",
        // forTxHash: "0xdf09971dd9941ab3fcb83293dc9afb41f5157ff7610dc9a9eca3ae8939f6e421",
        // forId: 'ca91c8f1-4b0f-4ff6-8774-5a95c93a4551', //"0x78ba2fbd57eb339719d0af173b7709d93b9125d2d5910cf71e0ad4505901a5a9"
        where: {
          from: ["0x0242"],
        },
      });
      console.log(result);
    }
  }
  async function checkstatus() {
    const result = await lensClient.transaction.status({ forTxId: data });

    // or wait till status is complete
    // const result = await lensClient.transaction.waitUntilComplete({
    //   forTxId: TX_ID,
    // });
    console.log(result);
  }
  async function createMetadata() {
    // const metadata = link({
    // sharingLink:"ipfs://QmZ1A9npSQvV72nYy9UJb2K42J4U7P9HXM1moW6R2L5sLG"
    // })
    //0x0202-0x0d
    const metadata = image({
      image: {
        item: "ipfs://QmZ1A9npSQvV72nYy9UJb2K42J4U7P9HXM1moW6R2L5sLG",
        type: MediaImageMimeType.PNG,
      },
    });
    const result = await lensClient.publication.validateMetadata({
      json: JSON.stringify(metadata),
    });
    console.log(result);
  }
  async function addComment() {
    // const metadata = link({
    // sharingLink:"ipfs://QmZ1A9npSQvV72nYy9UJb2K42J4U7P9HXM1moW6R2L5sLG"
    // })
    //0x0202-0x0d

    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      var content = "COMMENT on Post";
      var contentName = "Comment Message";
      var imageUri = "";
      var imageType = "";
      var fullContentURI = await getContentURI(content, contentName, imageUri, imageType);

      const result = await lensClient.publication.commentOnchain({
        commentOn: "0x0202-0x0d",
        contentURI: fullContentURI, // or arweave
      });

      console.log(result);
      const resultValue = result.unwrap();
      //d4727e1e-4abb-4ade-842e-4eac1391a9ef
      if (!isRelaySuccess(resultValue)) {
        console.log(`Something went wrong`, resultValue);
        return;
      }

      console.log(`Transaction was successfully broadcasted with txId ${resultValue.txId}`);
    }
  }
  async function createMirror() {
    const result = await lensClient.publication.mirrorOnchain({
      mirrorOn: "0x0202-0x0d",
    });
    console.log(result);
  }
  async function getTags() {
    const result = await lensClient.publication.tags();
    console.log(result);
  }
  const [data, setData] = React.useState("");
  return (
    <div>
      <button className="btn" onClick={() => getProfile()}>
        Get
      </button>
      <button className="btn" onClick={() => checkProfile()}>
        Check
      </button>
      <button className="btn" onClick={() => LoginAccount()}>
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
      <input
        onChange={e => {
          setData(e.target.value);
        }}
      ></input>
      <button className="btn" onClick={() => checkPublications()}>
        checkPublications
      </button>
      <button className="btn" onClick={() => checkstatus()}>
        checkstatus
      </button>
      <button className="btn" onClick={() => createMetadata()}>
        createMetadata
      </button>
      <button className="btn" onClick={() => getTags()}>
        getTags
      </button>
      <button className="btn" onClick={() => addComment()}>
        addComment
      </button>
      <button className="btn" onClick={() => createMirror()}>
        createMirror
      </button>
      {(isauthdone||handle!=null)? <Profile params={handle} /> :  <Login isauthdone={isauthdone} setisauthdone={setisauthdone} />}
     
      {/* <Profile /> */}
    </div>
  );
}
