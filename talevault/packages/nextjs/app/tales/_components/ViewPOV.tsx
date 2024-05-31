"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import TALETRADE_CONTRACT from "../../../../hardhat/deployments/polygonAmoy/TaleTrade.json";
import MarkDown from "./MarkDown";
import { BigNumber, ethers } from "ethers";
import "flowbite";
import { useAccount } from "wagmi";
import { BoltIcon, TagIcon } from "@heroicons/react/24/outline";
import { TaleTokenAddress } from "~~/hardhat/deployments/polygonAmoy/TaleTrade.json";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function ViewPOV() {
  const genres = [
    "Literary Fiction",
    "Historical Fiction",
    "Science Fiction",
    "Fantasy",
    "Magical Realism",
    "Horror",
    "Mystery",
    "Thriller",
    "Crime",
    "Romance",
    "Romantic Comedy",
    "Suspense",
    "Adventure",
    "Action",
    "Speculative Fiction",
    "Dystopian",
    "Post-Apocalyptic",
    "Supernatural",
    "Mythology",
    "Fables and Folktales",
    "Autobiography/Memoir",
    "Biography",
    "History",
    "True Crime",
    "Travel Writing",
    "Nature Writing",
    "Science and Technology",
    "Self-Help/Personal Development",
    "Philosophy",
    "Religion and Spirituality",
    "Politics and Current Affairs",
    "Business and Economics",
    "Arts and Entertainment",
    "Sports and Recreation",
    "Health and Wellness",
    "Cookbooks and Food Writing",
    "Poetry",
    "Drama/Plays",
    "Short Stories",
    "Comics/Graphic Novels",
    "Children's Literature",
    "Young Adult (YA) Fiction",
    "Fanfiction",
    "Interactive Fiction/Choose Your Own Adventure",
    "Experimental/Avant-garde",
    "Other",
  ];
  const [povList, setpovList] = useState([]);
  const [genreSearch, setgenreSearch] = useState(genres);
  const [itemType, setItemType] = useState("");
  const getPovCreated = JSON.stringify({
    query: `
      query MyQuery {
        povcreateds {
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
  const getVoteReputation = JSON.stringify({
    query: `
    query MyQuery {
      voteReputations(where: {creator: ""}) {
        amt
        creator
        id
        transactionHash
      }
    }
  `,
  });

  async function handleGetPOVs() {
    const response = await fetch("https://api.studio.thegraph.com/query/41847/tales_final/latest", {
      headers: {
        "content-type": "application/json",
      },

      method: "POST",
      body: getPovCreated,
    });
    const value = await response.json();
    const response2 = await fetch("https://api.studio.thegraph.com/query/41847/tales_final/latest", {
      headers: {
        "content-type": "application/json",
      },

      method: "POST",
      body: getPovBought,
    });
    const value2 = await response2.json();

    let bought = value2.data.povcreateds.map(pov => pov.token_id);

    setpovList(value.data.povcreateds.filter(pov => !bought.includes(pov.token_id)));
    console.log(value.data.povcreateds.filter(pov => !bought.includes(pov.token_id)));
  }
  const { address } = useAccount();
  console.log("address:" + address?.toString());

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("TaleTrade");
  const { writeContractAsync: writeYourContractAsync2 } = useScaffoldWriteContract("Trade");
  async function check() {
    var reply3 = await writeYourContractAsync2({
      functionName: "allowlistDestinationChain",
      args: [BigNumber.from("14767482510784806043").toBigInt(), true],
    });
  }
  async function handleBuyPov(pov: any) {
    try {
      console.log(pov);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const USDC_ADDRESS = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";
      const ABI = [
        {
          constant: true,
          inputs: [],
          name: "name",
          outputs: [{ name: "", type: "string" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            { name: "_spender", type: "address" },
            { name: "_value", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ name: "", type: "bool" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "totalSupply",
          outputs: [{ name: "", type: "uint256" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [{ name: "_account", type: "address" }],
          name: "unBlacklist",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            { name: "_from", type: "address" },
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
          ],
          name: "transferFrom",
          outputs: [{ name: "", type: "bool" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [{ name: "minter", type: "address" }],
          name: "removeMinter",
          outputs: [{ name: "", type: "bool" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [{ name: "", type: "uint8" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            { name: "_name", type: "string" },
            { name: "_symbol", type: "string" },
            { name: "_currency", type: "string" },
            { name: "_decimals", type: "uint8" },
            { name: "_masterMinter", type: "address" },
            { name: "_pauser", type: "address" },
            { name: "_blacklister", type: "address" },
            { name: "_owner", type: "address" },
          ],
          name: "initialize",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "masterMinter",
          outputs: [{ name: "", type: "address" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [],
          name: "unpause",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            { name: "_to", type: "address" },
            { name: "_amount", type: "uint256" },
          ],
          name: "mint",
          outputs: [{ name: "", type: "bool" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [{ name: "_amount", type: "uint256" }],
          name: "burn",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            { name: "minter", type: "address" },
            { name: "minterAllowedAmount", type: "uint256" },
          ],
          name: "configureMinter",
          outputs: [{ name: "", type: "bool" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [{ name: "_newPauser", type: "address" }],
          name: "updatePauser",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "paused",
          outputs: [{ name: "", type: "bool" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [{ name: "account", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "", type: "uint256" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [],
          name: "pause",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [{ name: "minter", type: "address" }],
          name: "minterAllowance",
          outputs: [{ name: "", type: "uint256" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "owner",
          outputs: [{ name: "", type: "address" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "symbol",
          outputs: [{ name: "", type: "string" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "pauser",
          outputs: [{ name: "", type: "address" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
          ],
          name: "transfer",
          outputs: [{ name: "", type: "bool" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [{ name: "_newMasterMinter", type: "address" }],
          name: "updateMasterMinter",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [{ name: "account", type: "address" }],
          name: "isMinter",
          outputs: [{ name: "", type: "bool" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [{ name: "_newBlacklister", type: "address" }],
          name: "updateBlacklister",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "blacklister",
          outputs: [{ name: "", type: "address" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
          ],
          name: "allowance",
          outputs: [{ name: "", type: "uint256" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "currency",
          outputs: [{ name: "", type: "string" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [{ name: "newOwner", type: "address" }],
          name: "transferOwnership",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [{ name: "_account", type: "address" }],
          name: "blacklist",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [{ name: "_account", type: "address" }],
          name: "isBlacklisted",
          outputs: [{ name: "", type: "bool" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, name: "minter", type: "address" },
            { indexed: true, name: "to", type: "address" },
            { indexed: false, name: "amount", type: "uint256" },
          ],
          name: "Mint",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, name: "burner", type: "address" },
            { indexed: false, name: "amount", type: "uint256" },
          ],
          name: "Burn",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, name: "minter", type: "address" },
            { indexed: false, name: "minterAllowedAmount", type: "uint256" },
          ],
          name: "MinterConfigured",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [{ indexed: true, name: "oldMinter", type: "address" }],
          name: "MinterRemoved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [{ indexed: true, name: "newMasterMinter", type: "address" }],
          name: "MasterMinterChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [{ indexed: true, name: "_account", type: "address" }],
          name: "Blacklisted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [{ indexed: true, name: "_account", type: "address" }],
          name: "UnBlacklisted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [{ indexed: true, name: "newBlacklister", type: "address" }],
          name: "BlacklisterChanged",
          type: "event",
        },
        { anonymous: false, inputs: [], name: "Pause", type: "event" },
        { anonymous: false, inputs: [], name: "Unpause", type: "event" },
        {
          anonymous: false,
          inputs: [{ indexed: true, name: "newAddress", type: "address" }],
          name: "PauserChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, name: "owner", type: "address" },
            { indexed: true, name: "spender", type: "address" },
            { indexed: false, name: "value", type: "uint256" },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            { indexed: false, name: "previousOwner", type: "address" },
            { indexed: false, name: "newOwner", type: "address" },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, name: "from", type: "address" },
            { indexed: true, name: "to", type: "address" },
            { indexed: false, name: "value", type: "uint256" },
          ],
          name: "Transfer",
          type: "event",
        },
      ];
      // const ABI = [
      //   {
      //     constant: true,
      //     inputs: [],
      //     name: "name",
      //     outputs: [
      //       {
      //         name: "",
      //         type: "string",
      //       },
      //     ],
      //     payable: false,
      //     stateMutability: "view",
      //     type: "function",
      //   },
      //   {
      //     constant: false,
      //     inputs: [
      //       {
      //         name: "_spender",
      //         type: "address",
      //       },
      //       {
      //         name: "_value",
      //         type: "uint256",
      //       },
      //     ],
      //     name: "approve",
      //     outputs: [
      //       {
      //         name: "",
      //         type: "bool",
      //       },
      //     ],
      //     payable: false,
      //     stateMutability: "nonpayable",
      //     type: "function",
      //   },
      //   {
      //     constant: true,
      //     inputs: [],
      //     name: "totalSupply",
      //     outputs: [
      //       {
      //         name: "",
      //         type: "uint256",
      //       },
      //     ],
      //     payable: false,
      //     stateMutability: "view",
      //     type: "function",
      //   },
      //   {
      //     constant: false,
      //     inputs: [
      //       {
      //         name: "_from",
      //         type: "address",
      //       },
      //       {
      //         name: "_to",
      //         type: "address",
      //       },
      //       {
      //         name: "_value",
      //         type: "uint256",
      //       },
      //     ],
      //     name: "transferFrom",
      //     outputs: [
      //       {
      //         name: "",
      //         type: "bool",
      //       },
      //     ],
      //     payable: false,
      //     stateMutability: "nonpayable",
      //     type: "function",
      //   },
      //   {
      //     constant: true,
      //     inputs: [],
      //     name: "decimals",
      //     outputs: [
      //       {
      //         name: "",
      //         type: "uint8",
      //       },
      //     ],
      //     payable: false,
      //     stateMutability: "view",
      //     type: "function",
      //   },
      //   {
      //     constant: true,
      //     inputs: [
      //       {
      //         name: "_owner",
      //         type: "address",
      //       },
      //     ],
      //     name: "balanceOf",
      //     outputs: [
      //       {
      //         name: "balance",
      //         type: "uint256",
      //       },
      //     ],
      //     payable: false,
      //     stateMutability: "view",
      //     type: "function",
      //   },
      //   {
      //     constant: true,
      //     inputs: [],
      //     name: "symbol",
      //     outputs: [
      //       {
      //         name: "",
      //         type: "string",
      //       },
      //     ],
      //     payable: false,
      //     stateMutability: "view",
      //     type: "function",
      //   },
      //   {
      //     constant: false,
      //     inputs: [
      //       {
      //         name: "_to",
      //         type: "address",
      //       },
      //       {
      //         name: "_value",
      //         type: "uint256",
      //       },
      //     ],
      //     name: "transfer",
      //     outputs: [
      //       {
      //         name: "",
      //         type: "bool",
      //       },
      //     ],
      //     payable: false,
      //     stateMutability: "nonpayable",
      //     type: "function",
      //   },
      //   {
      //     constant: true,
      //     inputs: [
      //       {
      //         name: "_owner",
      //         type: "address",
      //       },
      //       {
      //         name: "_spender",
      //         type: "address",
      //       },
      //     ],
      //     name: "allowance",
      //     outputs: [
      //       {
      //         name: "",
      //         type: "uint256",
      //       },
      //     ],
      //     payable: false,
      //     stateMutability: "view",
      //     type: "function",
      //   },
      //   {
      //     payable: true,
      //     stateMutability: "payable",
      //     type: "fallback",
      //   },
      //   {
      //     anonymous: false,
      //     inputs: [
      //       {
      //         indexed: true,
      //         name: "owner",
      //         type: "address",
      //       },
      //       {
      //         indexed: true,
      //         name: "spender",
      //         type: "address",
      //       },
      //       {
      //         indexed: false,
      //         name: "value",
      //         type: "uint256",
      //       },
      //     ],
      //     name: "Approval",
      //     type: "event",
      //   },
      //   {
      //     anonymous: false,
      //     inputs: [
      //       {
      //         indexed: true,
      //         name: "from",
      //         type: "address",
      //       },
      //       {
      //         indexed: true,
      //         name: "to",
      //         type: "address",
      //       },
      //       {
      //         indexed: false,
      //         name: "value",
      //         type: "uint256",
      //       },
      //     ],
      //     name: "Transfer",
      //     type: "event",
      //   },
      // ];
      const USDC = new ethers.Contract(USDC_ADDRESS, ABI, signer);
      //const contracts = await USDC.transfer(TALETRADE_CONTRACT.address, BigNumber.from(pov.amt).toBigInt());
      // console.log(contracts);
      if (pov.network === "Sepolia") {
        const contracts = await USDC.transfer(TALETRADE_CONTRACT.address, BigNumber.from(pov.amt).toBigInt());

        console.log("Started..");
        var reply2 = await writeYourContractAsync2({
          functionName: "transferTokensPayLINK",
          args: [
            BigNumber.from("16015286601757825753").toBigInt(),
            pov.creator,
            USDC_ADDRESS,
            BigNumber.from(parseFloat(pov.amt.toString()) / 10 ** 6).toBigInt(),
          ],
        });
        console.log(reply2);
      } else if (pov.network === "Fuji") {
        const contracts = await USDC.transfer(TALETRADE_CONTRACT.address, BigNumber.from(pov.amt).toBigInt());

        console.log("Started..");
        var reply2 = await writeYourContractAsync2({
          functionName: "transferTokensPayLINK",
          args: [
            BigNumber.from("14767482510784806043").toBigInt(),
            pov.creator,
            USDC_ADDRESS,
            BigNumber.from(parseFloat(pov.amt.toString()) / 10 ** 6).toBigInt(),
          ],
        });
        console.log(reply2);
      } else {
        const contracts = await USDC.transfer(pov.creator, BigNumber.from(pov.amt).toBigInt());
      }
    } catch (e) {
      console.error("Error setting greeting:", e);
    }
  }

  async function handleReleaseNFT(pov: any) {
    try {
      console.log(pov);
      console.log(pov.token_id);
      var reply1 = await writeYourContractAsync({
        functionName: "toTransferFrom",
        args: [
          pov.creator.toString(),
          "0xe8658Dddc779097882A0f963f2C65fACBBa51ed1",
          BigNumber.from(pov.token_id).toBigInt(),
          pov.network,
        ],
      });
      console.log(reply1);
      console.log(pov);
    } catch (e) {
      console.error("Error setting greeting:", e);
    }
  }
  useEffect(() => {
    handleGetPOVs();
  }, []);

  return (
    <div className="grid grid-cols-3">
      {/* <input
                    type="submit"
                    onClick={() => check()}
                    value="Check"
                    className="btn m-auto mt-2 p-auto"
                  /> */}
      {povList.map(pov => {
        return (
          <div className="m-4 p-4 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="px-5 pb-5">
              <a href="#">
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{pov.name}</h5>
              </a>
              <div className="flex items-center mt-2.5 mb-5">
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <svg
                    className="w-4 h-4 text-yellow-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-yellow-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-yellow-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-yellow-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-gray-200 dark:text-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                </div>
                <span className="bg-primary text-xs font-semibold px-2.5 py-0.5 rounded  ms-3">5.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {parseFloat(pov.amt.toString()) / 10 ** 6} USDC
                </span>
                {address?.toLowerCase()?.toString() != pov.creator.toString() ? (
                  <input
                    type="submit"
                    onClick={() => handleBuyPov(pov)}
                    value="Add to Cart"
                    className="btn m-auto mt-2 p-auto"
                  />
                ) : (
                  <input
                    type="submit"
                    onClick={() => handleReleaseNFT(pov)}
                    value="Release NFT"
                    className="btn m-auto mt-2 p-auto"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
