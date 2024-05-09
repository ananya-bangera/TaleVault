"use client";

import { useState } from "react";
import MarkDown from "./_components/MarkDown";
import "flowbite";
import type { NextPage } from "next";
import { BoltIcon, LightBulbIcon, PlusIcon, TagIcon } from "@heroicons/react/24/outline";

const Tales: NextPage = () => {
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

  return (
    <div className="flex flex-col items-center p-8">
      <div className="flex flex-row place-content-center">
        <div className="card items-center w-96 bg-base-100 shadow-xl m-2 p-4 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="card-body items-center">
              <h2 className="card-title font-mono ">Create a POV</h2>
              <PlusIcon color="bg-secondary" className="h-12 w-12 p-2 justify-center rounded-full bg-secondary m-2" />
              <p className="text-center font-mono">Publish your POVs for trading and gain reputation!</p>
            </div>
          </label>
        </div>
        <div className="card items-center w-96 bg-base-100 shadow-xl m-2 p-4 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="card-body items-center">
              <h2 className="card-title font-mono ">Purchase POVs</h2>
              <LightBulbIcon
                color="bg-secondary"
                className="h-12 w-12 justify-center rounded-full bg-secondary m-2 p-2"
              />
              <p className="text-center font-mono">Flourish. Acquire premium POVs. Cultivate captivating content!</p>
            </div>
          </label>
        </div>
      </div>
      <div className="card items-center w-full  m-8 shadow-xl  p-8  dark:bg-gray-700 bg-secondary ">
        <div className=" items-center w-full p-8 ">
          {/* <label className="input input-bordered flex items-center gap-2">
          Name
          <input type="text" className="grow" placeholder="Daisy" />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          Email
          <input type="text" className="grow" placeholder="daisy@site.com" />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search" />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label> */}

          <div className="flex flex-row items-center justify-center mb-8">
            <label className="input flex items-center m-2">
              <BoltIcon className="w-4 h-4 m-2" />

              <input type="text" className="grow items-center" placeholder="Title for your POV" />
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
                    placeholder="Select Genre"
                    value={itemType}
                    onChange={e => {
                      setItemType(e.target.value);
                      setgenreSearch(genres.filter(ele => ele.toString().includes(e.target.value)));
                    }}
                  />
                  {/* <span className="badge badge-info">Optional</span> */}
                </label>

                <div
                  id="dropdownDots"
                  className="z-10 h-48 hidden overflow-auto bg-white divide-y divide-gray-100 rounded-lg shadow w-100 dark:bg-gray-700 dark:divide-gray-600"
                >
                  <ul
                    className=" py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownMenuIconButton"
                  >
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
            </div>
          </div>
          <div className="justify-center">
            <MarkDown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tales;
