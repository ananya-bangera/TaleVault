"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NextResponse } from "next/server";
import TALETRADE_CONTRACT from "../../../../hardhat/deployments/polygonAmoy/TaleTrade.json";
import { LensClient, development, isRelaySuccess } from "@lens-protocol/client";
import MDEditor from "@uiw/react-md-editor";
import { BigNumber, ethers } from "ethers";
import { encode } from "punycode";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";
import { useAccount, useWalletClient } from "wagmi";
import { BoltIcon, GlobeAltIcon, PlusIcon, TagIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

let bought = [];
const style = {
  control: base => ({
    ...base,
    border: 0,
    // This line disable the blue border
    boxShadow: "none",
  }),
};
export default function Profile({ params }) {

  let viewHandle = params.handle; //others prfile handle
  let handle = localStorage.getItem("handle"); // my profile handle
  const [identity, setIdentity] = useState({});
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [createCont, setcreateCont] = useState(false);
  const [cid, setCid] = useState("");
  const [publications, setPublications] = useState([]);
  const [submitButton, setSubmitButton] = useState("Submit");
  let pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  let pinataApiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
  const itemsOpt = new Map();
  const axios = require("axios");
  const FormData = require("form-data");
  console.log(viewHandle);
  console.log(handle);
  const [profileManager, setprofileManager] = useState(localStorage.getItem("profileManager"));
  const [followers, setFollowers] = useState([]);
  let profile_id = "";
  let my_profile_id = localStorage.getItem("profile_id");
  const { address: connectedAddress } = useAccount();
  let my_address = connectedAddress;
  console.log(`connectedAdress ${connectedAddress}`);
  const lensClient = new LensClient({
    environment: development,
  });
  async function checkProfile() {
    let handle_check = viewHandle == undefined || viewHandle == handle ? handle : viewHandle;
    console.log(`check handle: ${handle_check}`);
    const profileByHandle = await lensClient.profile.fetch({
      forHandle: `lens/${handle_check}`,
    });
    console.log(profileByHandle);
    profile_id = profileByHandle?.id;
    console.log(profile_id);
  }
  async function LoginAccount() {
    const { id, text } = await lensClient.authentication.generateChallenge({
      signedBy: connectedAddress ?? "", // e.g "0xdfd7D26fd33473F475b57556118F8251464a24eb"
      for: my_profile_id, // e.g "0x01"
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
    await checkProfile();
  }

  async function isProfMngrEnabled() {
    await LoginAccount();

    const profile = await lensClient.profile.fetch({
      forProfileId: profile_id,
    });
    console.log(profile?.signless);
    if (profile?.signless) {
      console.log("Profile manager is enabled");
    } else {
      console.log("Profile manager is disabled");
      await enableProfileManager();
    }
  }
  async function enableProfileManager() {
    const typedDataResult = await lensClient.profile.createChangeProfileManagersTypedData({
      approveSignless: true, // or false to disable
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
    localStorage.setItem("profileManager", "true");
  }
  async function followProfileID() {
    await LoginAccount();
    console.log(profile_id);
    console.log(my_profile_id);
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      const result = await lensClient.profile.follow({
        follow: [
          {
            profileId: profile_id,
          },
        ],
      });
      await checkFollowers();
    }
  }
  const createContentMetadata = function (titleContent: any, content: any, videoUri: any, videoType: any, tags: any) {
    return {
      version: "2.0.0",
      metadata_id: uuidv4(),
      description: "Created from LensBlog",
      content: content,
      name: titleContent,
      mainContentFocus: "ARTICLE",
      attributes: [],
      locale: "en-US",
      appId: "lensblog",
      video: videoUri,
      imageMimeType: videoType,
      tags: tags,
    };
  };
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
  async function getContentURI(titleContent: any, content: any, vidUri: any, vidType: any, tags: any) {
    let fullContentURI = "";

    const contentMetadata = createContentMetadata(titleContent, content, vidUri, vidType, tags);

    const BASE_64_PREFIX = "data:application/json;base64,";
    if (pinataApiSecret && pinataApiKey) {
      const metadataIpfsHash = await pinMetadataToPinata(contentMetadata, titleContent, pinataApiKey, pinataApiSecret);
      fullContentURI = `ipfs://${metadataIpfsHash}`;
      console.log(fullContentURI);
    } else {
      const base64EncodedContent = encode(JSON.stringify(contentMetadata));
      const fullContentURI = BASE_64_PREFIX + base64EncodedContent;
    }
    return fullContentURI;
  }
  async function handleCreateContent() {
    console.log(title);
    console.log(identity);
    console.log(cid);
    setUploading(true);
    setSubmitButton("Posting your Publication...");
    await LoginAccount();
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      var vidUri = `ipfs://${cid}`;
      var vidType = "video/mpv4";
      var fullContentURI = await getContentURI(title, identity.story, vidUri, vidType, [identity.identify,identity.creator]);

      const result = await lensClient.publication.postOnchain({
        contentURI: fullContentURI, // or arweave
      });
      console.log(result);
      const resultValue = result.unwrap();

      if (!isRelaySuccess(resultValue)) {
        setUploading(false);
        setSubmitButton("Submit");
        console.log(`Something went wrong`, resultValue);
        return;
      }
      console.log(`Transaction was successfully broadcasted with txId ${resultValue.txId}`);
    }
    setUploading(false);
    setSubmitButton("Submit");
  }
  async function uploadFileToIPFS(fileToUpload: any) {
    try {
      setUploading(true);
      setSubmitButton("Uploading File to IPFS...");
      console.log("start...");
      const formData = new FormData();

      // const file = fs.createReadStream(src)
      formData.append("file", fileToUpload);
      console.log("called1");
      const pinataMetadata = JSON.stringify({
        name: fileToUpload.name,
      });
      formData.append("pinataMetadata", pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", pinataOptions);
      console.log("called");

      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
      });

      console.log(res.data.IpfsHash);
      setCid(res.data.IpfsHash);
      setUploading(false);
      setSubmitButton("Submit");
      return NextResponse.json({ IpfsHash: res.data.IpfsHash }, { status: 200 });
    } catch (e) {
      console.log(e);
      setUploading(false);
      setSubmitButton("Submit");
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  async function checkFollowers() {
    // const isAuthenticated = await lensClient.authentication.isAuthenticated();
    // console.log(isAuthenticated);
    // if (isAuthenticated) {
    console.log(`ananya address ${connectedAddress}`);
    await checkProfile();
    const result = await lensClient.profile.followers({
      of: profile_id ?? "",
    });
    setFollowers(result.items);
    console.log(
      `Followers:`,
      result.items.map(p => p.handle),
    );
    // await handleGetPOVs();
    // }
  }

  const getPovBought = JSON.stringify({
    query: `
      query MyQuery {
        povcreateds(where: {status: true}) {
          amt
          creator
          genre
          id
          identify
          name
          network
          status
          story
          transactionHash
          token_id
        }
      }
  `,
  });

  async function handleGetPOVs() {
    console.log("my_address");
    console.log(my_address);
    if (connectedAddress === undefined) {
      console.log("connectedAddress is undefined");
    }
    console.log(`connectedAdress ${connectedAddress}`);
    // while (connectedAddress == undefined) {
    //   console.log("waiting for address");
    // }
    console.log(`connectedAdress ${connectedAddress}`);

    const response2 = await fetch("https://api.studio.thegraph.com/query/41847/tales_final/latest", {
      headers: {
        "content-type": "application/json",
      },

      method: "POST",
      body: getPovBought,
    });
    const value2 = await response2.json();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const TaleTradeContract = new ethers.Contract(TALETRADE_CONTRACT.address, TALETRADE_CONTRACT.abi, signer);

    await value2.data.povcreateds.map(async pov => {
      // console.log(pov);
      let owner = await TaleTradeContract.ownerOf(BigNumber.from(pov.token_id).toBigInt());
      console.log(owner);
      console.log(connectedAddress);
      console.log("******");
      let ans = await owner.toString();
      console.log(connectedAddress == owner);
      if (ans === connectedAddress && itemsOpt.get(pov.name) == undefined) {
        // console.log(itemsOpt.get("ananya"));
        bought.push({ value: pov, label: pov.name });
        itemsOpt.set(pov.name, pov.identify);
      }
    });
    console.log(bought);
    console.log(itemsOpt);
    setcreateCont(true);
  }
  async function checkPublications() {
    await checkProfile();
    // await LoginAccount();
    // console.log("profile_id")
    // console.log(profile_id)
    // const isAuthenticated = await lensClient.authentication.isAuthenticated();
    // console.log(isAuthenticated);
    // if (isAuthenticated) {
    // lensClient.publication.fetchAll
    const result = await lensClient.publication.fetchAll({
      where: {
        from: [profile_id],
      },
    });
    console.log(result.items);
    setPublications(result.items);
    console.log(result);
    // }
  }

  useEffect(() => {
    checkFollowers();
    checkPublications();
  }, []);
  return (
    <div className="">
      <div className="w-full text-white bg-main-color">
        <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
          <div className="p-4 flex flex-row items-center justify-between">
            <button className="md:hidden rounded-lg focus:outline-none focus:shadow-outline">
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                <path
                  x-show="!open"
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
                <path
                  x-show="open"
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          {/* <nav className="flex-col flex-grow pb-4 md:pb-0 hidden md:flex md:justify-end md:flex-row">
            <div className="relative" x-data="{ open: false }">
              <button className="flex flex-row items-center space-x-2 w-full px-4 py-2 mt-2 text-sm font-semibold text-left bg-transparent hover:bg-blue-800 md:w-auto md:inline md:mt-0 md:ml-4 hover:bg-gray-200 focus:bg-blue-800 focus:outline-none focus:shadow-outline">
                <span>{handle}</span>
                <img
                  className="inline h-6 rounded-full"
                  src="https://avatars2.githubusercontent.com/u/24622175?s=60&amp;v=4"
                />
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="inline w-4 h-4 transition-transform duration-200 transform"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <div className="absolute right-0 w-full mt-2 origin-top-right rounded-md shadow-lg md:w-48">
                <div className="py-2 bg-white text-blue-800 text-sm rounded-sm border border-main-color shadow-sm">
                  <a
                    className="block px-4 py-2 mt-2 text-sm bg-white md:mt-0 focus:text-gray-900 hover:bg-indigo-100 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                    href="#"
                  >
                    Settings
                  </a>
                  <a
                    className="block px-4 py-2 mt-2 text-sm bg-white md:mt-0 focus:text-gray-900 hover:bg-indigo-100 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                    href="#"
                  >
                    Help
                  </a>
                  <div className="border-b"></div>
                  <a
                    className="block px-4 py-2 mt-2 text-sm bg-white md:mt-0 focus:text-gray-900 hover:bg-indigo-100 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                    href="#"
                  >
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </nav> */}
        </div>
      </div>

      <div className="container mx-auto my-5 p-5">
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full md:w-3/12 md:mx-2">
            <div className="card bg-white p-3 ">
              <div className="image overflow-hidden">
                <img
                  className="h-auto w-full mx-auto"
                  src="https://lavinephotography.com.au/wp-content/uploads/2017/01/PROFILE-Photography-112.jpg"
                  alt=""
                />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {viewHandle == undefined ? handle : viewHandle}
              </h1>
             
              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>Profile Manager</span>
                  <span className="ml-auto">
                    <button
                      onClick={() => isProfMngrEnabled()}
                      className="bg-primary py-1 px-2 rounded text-white text-sm"
                    >
                      {profileManager === "true" ? "Active" : "Activate"}
                    </button>
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>Member since</span>
                  <span className="ml-auto">Nov 07, 2016</span>
                </li>
              </ul>

              <button className="btn m-8" onClick={() => followProfileID()}>
                Follow
              </button>
              {/* <button className="btn m-8" onClick={() => handleGetPOVs()}>
                HandlePOVS
              </button> */}
            </div>

            <div className="my-4"></div>

            <div className="card bg-white p-3 hover:shadow">
              <div className="flex items-center space-x-3 font-semibold text-gray-900 text-xl leading-8">
                <span className="text-primary">
                  <svg
                    className="h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>
                <span>Followers</span>
              </div>
              <div className="">
                <ul className=" rounded overflow-hidden">
                  {followers.length == 0 ? (
                    <li className="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">
                      No Followers
                    </li>
                  ) : (
                    <>
                      {followers.map(follower => {
                        return (
                          <Link key={follower.handle.localName} href={`/lens/${follower.handle.localName}`}>
                            <li className="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">
                              {follower.handle.localName}
                            </li>
                          </Link>
                        );
                      })}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full md:w-9/12 mx-2 h-64">
            <div className="card items-center w-full  m-4 shadow-xl  p-8  dark:bg-gray-700 bg-secondary ">
              {createCont ? (
                <>
                  <h1 className="card-title font-mono ">Create Publication</h1>
                  <div className=" items-center w-full p-8 ">
                    <div className="flex flex-row items-center justify-evenly mb-8 w-full">
                      <label className="input flex items-center m-2">
                        <BoltIcon className="w-4 h-4 m-2" />
                        <input
                          type="text"
                          className=" input items-center border-0"
                          placeholder="Title for your Content"
                          onChange={e => setTitle(e.target.value)}
                        />
                      </label>
                      <div className="dropdown-right m-2 inline-flex items-center w-2/5">
                        <label className="input flex items-center min-w-full">
                          <TagIcon className="w-4 h-4 m-2" />
                          <Select
                            className="basic-single rounded-3xl border-0 w-full"
                            classNamePrefix="select"
                            isClearable={true}
                            isSearchable={true}
                            name="genre"
                            styles={style}
                            onChange={e => {
                              setIdentity(e.value);
                            }}
                            options={bought}
                          />
                        </label>
                      </div>
                      <div className="dropdown-right m-2 inline-flex items-center w-2/5">
                        <label className="input flex items-center min-w-full">
                          <GlobeAltIcon className="w-4 h-4 m-2" />
                          {/* <Select
                 className="basic-single rounded-3xl border-0 w-full bg-base-200"
                 classNamePrefix="select"
                 isClearable={true}
                 isSearchable={true}
                 name="network"
                 styles={style}
                 onChange={(e)=>setNetwork(e.value.toString())}
                 options={networkLabels}
               /> */}
                        </label>
                      </div>
                      <div className="m-2 w-1/4">
                        {/* <EtherInput value={ethAmount} onChange={amount => setEthAmount(amount)} /> */}
                      </div>
                    </div>

                    <div className="justify-center">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                stroke-width="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">MPV4 or GIF (MAX. 800x400px)</p>
                          </div>
                          <input
                            id="dropzone-file"
                            type="file"
                            onChange={e => {
                              uploadFileToIPFS(e.target.files[0]);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex place-content-center m-auto p-2">
                      <input
                        type="submit"
                        value={submitButton}
                        disabled={uploading}
                        onClick={() => handleCreateContent()}
                        className="btn m-auto mt-2 p-auto"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <button className="btn m-8 rounded-full" onClick={() => handleGetPOVs()}>
                  Create Publication
                </button>
              )}
            </div>
            <div className="card grid grid-cols-3 bg-white p-6 shadow-sm ">
              {publications
                  .filter(publication => publication.__typename == "Post").length == 0 ? (
                <h5 className="mb-2 text-lg m-auto  tracking-tight text-gray-900 dark:text-white">
                  No Publications Yet ...
                </h5>
              ) : (
                publications
                  .filter(publication => publication.__typename == "Post")
                  .map(publication => {
                    console.log(publication);
                    my_profile_id = localStorage.getItem("profile_id");
                    return (
                      // <li className="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">
                      //   {publication.toString()}
                      // </li>
                      <>
                        <Link
                          key={publication.id}
                          href={{
                            pathname: `/stream`,
                            query: {
                              id: publication.id,
                              connectedAddress: connectedAddress,
                              profile_id: my_profile_id,
                            },
                          }}
                        >
                          <div className="block max-w-sm p-6 m-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <h5 className="mb-2 text-xl text-center  tracking-tight text-gray-900 dark:text-white">
                              {publication.metadata.title}
                            </h5>
                          </div>
                        </Link>
                      </>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
