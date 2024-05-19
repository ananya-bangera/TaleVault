"use client";

import { useState } from "react";
import MarkDown from "./_components/MarkDown";
import "flowbite";
import type { NextPage } from "next";
import { BoltIcon, LightBulbIcon, PlusIcon, TagIcon } from "@heroicons/react/24/outline";
import CreatePOV from "./_components/CreatePOV";
import ViewPOV from "./_components/ViewPOV";


const Tales: NextPage = () => {
 const [createPOV, setcreatePOV] = useState(true)
  return (
    <div className="flex flex-col items-center p-8">
      <div className="flex flex-row place-content-center">
        <div onClick={()=>setcreatePOV(true)} className="card items-center w-96 bg-base-100 shadow-xl m-2 p-4 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="card-body items-center">
              <h2 className="card-title font-mono ">Create a POV</h2>
              <PlusIcon color="bg-secondary" className="h-12 w-12 p-2 justify-center rounded-full bg-secondary m-2" />
              <p className="text-center font-mono">Publish your POVs for trading and gain reputation!</p>
            </div>
          </label>
        </div>
        <div  onClick={()=>setcreatePOV(false)} className="card items-center w-96 bg-base-100 shadow-xl m-2 p-4 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
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
      {(createPOV)?<CreatePOV/>:(<ViewPOV/>)}
     
    </div>
  );
};

export default Tales;
