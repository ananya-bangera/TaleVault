"use client";

import React, { useState } from "react";
import MarkDown from "./MarkDown";
import "flowbite";
import { BoltIcon, TagIcon } from "@heroicons/react/24/outline";
import { EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";

export default function CreatePOV() {
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
  const [genreSearch, setgenreSearch] = useState(genres);
  const [itemType, setItemType] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [title, setTitle] = useState("");
  const {address} = useAccount();
  const network = "Amoy";
  const identify =  "" //uuid4();
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("Trade");
  async function handleCreatePOV() {
    try {
      await writeYourContractAsync({
        functionName: "transferTokensPayLINK",
        // functionName: "allowlistDestinationChain",
        args: ["16015286601757825753", "0xe8658Dddc779097882A0f963f2C65fACBBa51ed1","0xcab0EF91Bee323d1A617c0a027eE753aFd6997E4" ,"1000000000000000"],
        // args: ["16015286601757825753",true],
        // args: [ address,  identify, "uri", title, itemType, network, story, ethAmount],
      
      });
    } catch (e) {
      console.error("Error setting greeting:", e);
    }
  }
  return (
    <div className="card items-center w-full  m-12 shadow-xl  p-8  dark:bg-gray-700 bg-secondary ">
      <h1 className="card-title font-mono ">Create a POV</h1>
      <div className=" items-center w-full p-8 ">
        <div className="flex flex-row items-center justify-center mb-8">
          <label className="input flex items-center m-2">
            <BoltIcon className="w-4 h-4 m-2" />

            <input
              type="text"
              className=" input  items-center"
              placeholder="Title for your POV"
              onChange={e => setTitle(e.target.value)}
            />
            {/* <span className="badge badge-info">Optional</span> */}
          </label>
          <div className="dropdown-right m-2 inline-flex items-center">
            <div role="button justify-center">
              <label className="input flex items-center ">
                <TagIcon className="w-4 h-4 m-2" />

                <input
                  id="dropdownMenuIconButton"
                  data-dropdown-toggle="dropdownDots"
                  type="text"
                  className="input"
                  placeholder="Select Genre"
                  value={itemType}
                  onChange={e => {
                    setItemType(e.target.value);
                    setgenreSearch(genres.filter(ele => ele.toString().includes(e.target.value)));
                  }}
                />
              </label>
              <div
                id="dropdownDots"
                className="z-10 h-48 hidden overflow-auto bg-white divide-y divide-gray-100 rounded-lg shadow w-100 dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul className=" py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                  {genreSearch.map(genre => {
                    return (
                      <li>
                        <button
                          type="button"
                          onClick={() => setItemType(genre)}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          <div className=" items-left">{genre}</div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="m-2">
              <EtherInput value={ethAmount} onChange={amount => setEthAmount(amount)} />
            </div>
          </div>
        </div>

        <div className="justify-center">
          <MarkDown />
        </div>
        <div className="flex place-content-center m-auto p-2">
          <input type="submit" value="Submit" onClick={() => handleCreatePOV()} className="btn m-auto mt-2 p-auto" />
        </div>
      </div>
    </div>
  );
}
