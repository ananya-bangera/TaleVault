"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Auctions_dropdown from "./_components/Auctions_dropdown";
import Items_Countdown_timer from "./_components/items_countdown_timer";
import Likes from "./_components/likes";
import { LensClient, development, isRelaySuccess } from "@lens-protocol/client";
import Tippy from "@tippyjs/react";
import MDEditor from "@uiw/react-md-editor";
import { BigNumber, ethers } from "ethers";
import { encode } from "punycode";
import ReactPlayer from "react-player";
import { v4 as uuidv4 } from "uuid";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function DisplayPOV(context) {
  let image = "QmZ1A9npSQvV72nYy9UJb2K42J4U7P9HXM1moW6R2L5sLG";
  let ownerImage = "../../public/thumbnail.jpg";
  let creatorname = "Music Mania";
  let imageModal = true;
  let auction_timer = "636234213";
  let pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  let pinataApiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
  const [cid, setCid] = useState("");
  const [prof_id, setprof_id] = useState("");
  const [publication, setPublication] = useState();
  const [commentList, setcommentList] = useState([]);
  const [comment, setcomment] = useState("");
  const [author, setauthor] = useState("");
  const [publisher, setpublisher] = useState("");
  let likes = 46;
  let title = "Wizard World";

  // title: publication.metadata.title,
  //                     content: publication.metadata.content,
  //                     uri: publication.metadata.rawURI,
  //                     identify: publication.metadata.tags[0],
  //                     creator: publication.by.localName
  let { id, profile_id, connectedAddress } = context.searchParams;
  const lensClient = new LensClient({
    environment: development,
  });
  async function LoginAccount() {
    const { id, text } = await lensClient.authentication.generateChallenge({
      signedBy: connectedAddress ?? "", // e.g "0xdfd7D26fd33473F475b57556118F8251464a24eb"
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
  async function checkPublications() {
    await LoginAccount();
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      // lensClient.publication.fetchAll
      const result = await lensClient.publication.fetch({
        forId: id, //'9300e17e-987f-4df2-b0c9-519609f6710c'
        // forTxHash: "0xa552309a7f75258aeab723d441d0e5bc771eef2dcc3e0e9ce802c3b3d942dabc",
        // forTxHash: "0xdf09971dd9941ab3fcb83293dc9afb41f5157ff7610dc9a9eca3ae8939f6e421",
        // forId: 'ca91c8f1-4b0f-4ff6-8774-5a95c93a4551', //"0x78ba2fbd57eb339719d0af173b7709d93b9125d2d5910cf71e0ad4505901a5a9"
        // where: {
        //   from: ["0x0265"],
        // },
      });
      setPublication(result);
      setprof_id(result.by.id);

      console.log(result.metadata.rawURI.toString().slice(7));
      const response2 = await fetch("https://ipfs.io/ipfs/" + result.metadata.rawURI.toString().slice(7), {
        headers: {
          "content-type": "application/json",
        },

        method: "GET",
      });
      const value2 = await response2.json();
      console.log(result);
      console.log(value2.video.toString().slice(7));
      setauthor(result.metadata.tags[1]);
      setpublisher(result?.by.handle.ownedBy);
      setCid(value2.video.toString().slice(7));
    }
  }
  useEffect(() => {
    checkPublications();
    checkComments();
  }, []);

  async function voteForContent() {
    console.log(author);
    console.log(publisher);
    const strEther = "0.01";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    const gasfee=await provider.getGasPrice();
    const params = [
      {
        from: connectedAddress,
        to: author,
        value: ethers.utils.parseUnits(strEther, "ether").toHexString(),
        gasLimit: ethers.utils.hexlify(10000),
        gasPrice: ethers.utils.hexlify(gasfee),
      },
    ];

    const transactionHash = await provider.send("eth_sendTransaction", params);
    console.log("transactionHash is " + transactionHash);
  
    const params2 = [
      {
        from: connectedAddress,
        to: publisher,
        value: ethers.utils.parseUnits(strEther, "ether").toHexString(),
        gasLimit: ethers.utils.hexlify(10000),
        gasPrice: ethers.utils.hexlify(gasfee),
      },
    ];

    const transactionHash2 = await provider.send("eth_sendTransaction", params2);
    console.log("transactionHash is " + transactionHash2);
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
  async function addComment() {
    // const metadata = link({
    // sharingLink:"ipfs://QmZ1A9npSQvV72nYy9UJb2K42J4U7P9HXM1moW6R2L5sLG"
    // })
    //0x0202-0x0d
    console.log("comment" + comment);

    var contentName = "Comment Message";
    var imageUri = "";
    var imageType = "";
    var fullContentURI = await getContentURI(comment, contentName, imageUri, imageType);
    await LoginAccount();
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    console.log(id);
    const result = await lensClient.publication.commentOnchain({
      commentOn: id.toString(),
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
    const result2 = await lensClient.transaction.waitUntilComplete({
      forTxId: resultValue.txId,
    });
    await checkComments();
  }
  async function checkComments() {
    await LoginAccount();
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
    if (isAuthenticated) {
      // lensClient.publication.fetchAll
      const result = await lensClient.publication.fetchAll({
        where: {
          from: [profile_id],
        },
      });
      console.log(result);
      let temp = result.items.filter((item: any) => {
        if (item.commentOn) {
          return item.commentOn.id == id && item.__typename == "Comment";
        }
      });
      console.log(temp);

      setcommentList(temp);
    }
  }

  console.log(context.searchParams);
  return publication == undefined ? (
    <>
      <div className="items-center m-auto">Loading...</div>
    </>
  ) : (
    <div className="m-auto relative lg:mt-24 lg:pt-24 lg:pb-24 mt-24 pt-12 pb-24">
      <div className="container">
        <div className="md:flex md:flex-wrap" key={id}>
          {/* <iframe
            id="player"
            type="text/html"
            className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full"
            src={`https://ipfs.io/ipfs/${cid}`}
            frameborder="0"
          ></iframe> */}
          <ReactPlayer url={`https://ipfs.io/ipfs/${cid}`} controls={true} />
          <div className={imageModal ? "modal fade show block" : "modal fade"}>
            <div className="modal-dialog !my-0 flex h-full max-w-4xl items-center justify-center">
              <img src={`https://ipfs.io/ipfs/${image}`} alt={"Content Video"} className="h-full rounded-2xl" />
            </div>

            <button
              type="button"
              className="btn-close absolute top-6 right-6"
              //   onClick={() => setImageModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="h-6 w-6 fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
              </svg>
            </button>
          </div>

          <div className="md:w-3/5 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem]">
            <div className="mb-3 flex">
              <div className="flex items-center">
                {/* <Link href="#">
                  <div className="text-accent mr-2 text-sm font-bold">{publication.metadata.title}</div>
                </Link> */}
                <span
                  className="dark:border-jacarta-600 bg-green inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                  data-tippy-content="Verified Collection"
                >
                  <Tippy content={<span>Verified Collection</span>}>
                    <svg className="icon h-[.875rem] w-[.875rem] fill-white">
                      <use xlinkHref="/icons.svg#icon-right-sign"></use>
                    </svg>
                  </Tippy>
                </span>
              </div>

              <div className="ml-auto flex items-stretch space-x-2 relative">
                <Likes
                  like={publication.stats.upvotes}
                  classes="items-center space-x-1 rounded-xl bg-primary py-2 px-4"
                />
              </div>
            </div>

            <h1 className="font-display text-jacarta-700 mb-4 text-4xl font-semibold dark:text-white">
              {publication.metadata.title}
            </h1>

            <div className="mb-8 flex items-center space-x-4 whitespace-nowrap">
              <div className="flex items-center">
                <span className="text-green text-sm font-medium tracking-tight">${10} </span>
              </div>
            </div>

            <div className="mb-8 flex flex-wrap">
              <div className="mr-8 mb-4 flex">
                <div className="flex flex-col justify-center">
                  <span className="text-jacarta-400 block text-sm dark:text-white">Created By</span>
                  <Link href="/user/avatar_6">
                    <div className="text-accent block">
                      <span className="text-sm font-bold">{publication.by.handle.localName}</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mb-4 flex">
                <div className="flex flex-col justify-center">
                  <span className="text-jacarta-400 block text-sm dark:text-white">Written by</span>
                  <Link href="/user/avatar_6">
                    <div className="text-accent block">
                      <span className="text-sm font-bold">{publication.by.handle.localName}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="  border bg-secondary p-8  rounded-3xl">
              <div className="mb-8 sm:flex sm:flex-wrap">
                <div className="sm:w-1/2 sm:pr-4 lg:pr-8">
                  <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
                    <span className="dark:text-jacarta-300 text-jacarta-400 text-sm">Highest bid by </span>
                    <Link href="/user/avatar_6">
                      <div className="text-accent text-sm font-bold">0x695d2ef170ce69e794707eeef9497af2de25df82</div>
                    </Link>
                  </div>
                  <div className="mt-3 flex">
                    <figure className="mr-4 shrink-0">
                      <Link href="#">
                        <div className="relative block">
                          <img
                            src={`https://ipfs.io/ipfs/${image}`}
                            alt="avatar"
                            className="rounded-2lg h-12 w-12"
                            loading="lazy"
                          />
                        </div>
                      </Link>
                    </figure>
                    <div>
                      <div className="flex items-center whitespace-nowrap">
                        <span className="text-green text-lg font-medium leading-tight tracking-tight">{10} ETH</span>
                      </div>
                      <span className="dark:text-jacarta-300 text-jacarta-400 text-sm">~10,864.10</span>
                    </div>
                  </div>
                </div>

                <div className="dark:border-jacarta-600 sm:border-jacarta-100 mt-4 sm:mt-0 sm:w-1/2 sm:border-l sm:pl-4 lg:pl-8">
                  <span className="js-countdown-ends-label text-jacarta-400 dark:text-jacarta-300 text-sm">
                    Voting ends in
                  </span>
                  <Items_Countdown_timer time={+auction_timer} />
                </div>
              </div>

              <Link href="#">
                <button
                  className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-black transition-all"
                  onClick={() => voteForContent()}
                >
                  Vote Now
                </button>
              </Link>
            </div>
          </div>
          <div className="card m-8 w-2/5 bg-white p-6 shadow-sm ">
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                onChange={e => setcomment(e.target.value)}
                id="comment"
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..."
                required
              ></textarea>
            </div>
            <button type="submit" onClick={() => addComment()} className="btn m-auto">
              Post comment
            </button>

            {commentList.map((item: any) => {
              return (
                <div className="card bg-gray-100 m-2 p-4">
                  <p className="m-2 text-gray-500 dark:text-gray-400">{item.metadata.content}</p>
                </div>
              );
            })}
          </div>
          <div className="card m-8 w-2/5 bg-white p-6 shadow-sm ">
            {" "}
            <MDEditor.Markdown
              className="bg-white m-8 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              source={publication.metadata.content}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
