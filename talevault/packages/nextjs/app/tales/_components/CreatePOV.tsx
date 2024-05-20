"use client";

import React, { useState } from "react";
import MarkDown from "./MarkDown";
import "flowbite";
import Select from "react-select";
import { BoltIcon, GlobeAltIcon, TagIcon } from "@heroicons/react/24/outline";
import { EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";
import {BigNumber} from "ethers";
const genresLabels = [
  { value: "Literary Fiction", label: "Literary Fiction" },
  { value: "Historical Fiction", label: "Historical Fiction" },
  { value: "Science Fiction", label: "Science Fiction" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Magical Realism", label: "Magical Realism" },
  { value: "Horror", label: "Horror" },
  { value: "Mystery", label: "Mystery" },
  { value: "Thriller", label: "Thriller" },
  { value: "Crime", label: "Crime" },
  { value: "Romance", label: "Romance" },
  { value: "Romantic Comedy", label: "Romantic Comedy" },
  { value: "Suspense", label: "Suspense" },
  { value: "Adventure", label: "Adventure" },
  { value: "Action", label: "Action" },
  { value: "Speculative Fiction", label: "Speculative Fiction" },
  { value: "Dystopian", label: "Dystopian" },
  { value: "Post-Apocalyptic", label: "Post-Apocalyptic" },
  { value: "Supernatural", label: "Supernatural" },
  { value: "Mythology", label: "Mythology" },
  { value: "Fables and Folktales", label: "Fables and Folktales" },
  { value: "Autobiography/Memoir", label: "Autobiography/Memoir" },
  { value: "Biography", label: "Biography" },
  { value: "History", label: "History" },
  { value: "True Crime", label: "True Crime" },
  { value: "Travel Writing", label: "Travel Writing" },
  { value: "Nature Writing", label: "Nature Writing" },
  { value: "Science and Technology", label: "Science and Technology" },
  { value: "Self-Help/Personal Development", label: "Self-Help/Personal Development" },
  { value: "Philosophy", label: "Philosophy" },
  { value: "Religion and Spirituality", label: "Religion and Spirituality" },
  { value: "Politics and Current Affairs", label: "Politics and Current Affairs" },
  { value: "Business and Economics", label: "Business and Economics" },
  { value: "Arts and Entertainment", label: "Arts and Entertainment" },
  { value: "Sports and Recreation", label: "Sports and Recreation" },
  { value: "Health and Wellness", label: "Health and Wellness" },
  { value: "Cookbooks and Food Writing", label: "Cookbooks and Food Writing" },
  { value: "Poetry", label: "Poetry" },
  { value: "Drama/Plays", label: "Drama/Plays" },
  { value: "Short Stories", label: "Short Stories" },
  { value: "Comics/Graphic Novels", label: "Comics/Graphic Novels" },
  { value: "Children's Literature", label: "Children's Literature" },
  { value: "Young Adult (YA) Fiction", label: "Young Adult (YA) Fiction" },
  { value: "Fanfiction", label: "Fanfiction" },
  { value: "Interactive Fiction/Choose Your Own Adventure", label: "Interactive Fiction/Choose Your Own Adventure" },
  { value: "Experimental/Avant-garde", label: "Experimental/Avant-garde" },
  { value: "Other", label: "Other" },
];

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

const networkLabels = [
  { value: "Amoy", label: "Polygon Amoy" },
  { value: "Sepolia", label: "Ethereum Sepolia" },
  { value: "Fuji", label: "Avalanche Fuji" },
];

const style = {
  control: base => ({
    ...base,
    border: 0,
    // This line disable the blue border
    boxShadow: "none",
  }),
};

export default function CreatePOV() {
  const [genreSearch, setgenreSearch] = useState(genres);
  const [itemType, setItemType] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [title, setTitle] = useState("");
  const {address} = useAccount();
  const [network, setNetwork] = useState("");
  const [story , setStory] = useState("");
  const identify =  Date.now().toString();
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("TaleTrade");
  async function handleCreatePOV() {
    try {
      console.log(itemType);
      console.log(network);
      // await writeYourContractAsync({
      //   functionName: "safeMint",
      //   args: [ address,  identify, "uri", title, itemType, network, story, BigNumber.from(ethAmount).toBigInt()],
      //   // functionName: "transferTokensPayLINK",
      //   // functionName: "allowlistDestinationChain",
      //   // args: ["16015286601757825753", "0xe8658Dddc779097882A0f963f2C65fACBBa51ed1","0xcab0EF91Bee323d1A617c0a027eE753aFd6997E4" ,"1000000000000000"],
      //   // args: ["16015286601757825753",true],
      
      // });
    } catch (e) {
      console.error("Error setting greeting:", e);
    }
  }
  return (
    <div className="card items-center w-full  m-12 shadow-xl  p-8  dark:bg-gray-700 bg-secondary ">
      <h1 className="card-title font-mono ">Create a POV</h1>
      <div className=" items-center w-full p-8 ">
        <div className="flex flex-row items-center justify-evenly mb-8 w-full">
          <label className="input flex items-center m-2">
            <BoltIcon className="w-4 h-4 m-2" />
            <input
              type="text"
              className=" input items-center border-0"
              placeholder="Title for your POV"
              onChange={e => setTitle(e.target.value)}
            />
            {/* <span className="badge badge-info">Optional</span> */}
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
                onChange={(e)=>setItemType(e.value.toString())}
                options={genresLabels}
              />
            </label>
          </div>
          <div className="dropdown-right m-2 inline-flex items-center w-2/5">
            <label className="input flex items-center min-w-full">
              <GlobeAltIcon className="w-4 h-4 m-2" />
              <Select
                className="basic-single rounded-3xl border-0 w-full bg-base-200"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="network"
                styles={style}
                onChange={(e)=>setNetwork(e.value.toString())}
                options={networkLabels}
              />
            </label>
          </div>
          <div className="m-2 w-1/4">
            <EtherInput value={ethAmount} onChange={amount => setEthAmount(amount)} />
          </div>
        </div>

        <div className="justify-center">
          <MarkDown story={story} setStory={setStory}/>
        </div>
        <div className="flex place-content-center m-auto p-2">
          <input type="submit" value="Submit" onClick={() => handleCreatePOV()} className="btn m-auto mt-2 p-auto" />
        </div>
      </div>
    </div>
  );
}
