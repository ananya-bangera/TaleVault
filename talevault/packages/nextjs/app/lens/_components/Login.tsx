"use client";

import React, { useState } from "react";
import { LensClient, development } from "@lens-protocol/client";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
export default function Login({isauthdone, setisauthdone}:any) {
  const [handle, setHandle] = useState("");
  const { address } = useAccount();
  const lensClient = new LensClient({
    environment: development,
  });
  const [errorTakenHandle, setErrorTakenHandle] = useState(false);
  const [errorNonExistingHandle, setErrorNonExistingHandle] = useState(false);
  
  async function createProfile() {
    //ananya0302
    console.log(handle);
    setErrorTakenHandle(false);
    const profileCreateResult = await lensClient.wallet.createProfileWithHandle({
      handle: handle,
      to: address?.toString() || "",
    });
    if (profileCreateResult?.reason == "HANDLE_TAKEN") {
      setErrorTakenHandle(true);
    }
    console.log(profileCreateResult);
  }
  async function LoginAccount() {
    setErrorNonExistingHandle(false);
    const profileByHandle = await lensClient.profile.fetch({
      forHandle: `lens/${handle}`,
    });
    console.log(profileByHandle);
   if(profileByHandle){
    let profile_id = profileByHandle?.id;
    localStorage.setItem("profile_id", profile_id);
    const { id, text } = await lensClient.authentication.generateChallenge({
      signedBy: address ?? "", // e.g "0xdfd7D26fd33473F475b57556118F8251464a24eb"
      for: profile_id, // e.g "0x01"
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(text);
    await lensClient.authentication.authenticate({
      id, // returned from authentication.generateChallenge
      signature,
    });
    localStorage.setItem("handle", handle);
    const auth = await lensClient.authentication.isAuthenticated();
    setisauthdone(auth)
    console.log(auth);
   }
   else{
    setErrorNonExistingHandle(true);
   }
  }
  return (
    <div className="font-sans">
      <div className="relative min-h-screen flex flex-col sm:justify-center items-center ">
        <div className="relative sm:max-w-sm w-full">
          <div className="card bg-primary shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6"></div>
          <div className="card bg-secondary shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6"></div>
          <div className="relative w-full rounded-3xl  px-6 py-4 bg-gray-100 shadow-md">
            <label htmlFor="" className="block mt-3 text-sm text-gray-700 text-center font-semibold">
              Login
            </label>
            <div>
              <input
                type="text"
                onChange={(e)=>setHandle(e.target.value)}
                placeholder="Enter Handle"
                className="mt-1 p-2 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
              />
                {errorNonExistingHandle ? (
                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  Handle Doesn't Exist !
                </span>
              ) : (
                <></>
              )}
            </div>

            <div className="mt-7">
              <button onClick={()=>LoginAccount()} className="bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                Login
              </button>
            </div>

            <div className="flex mt-7 items-center text-center">
              <hr className="border-gray-300 border-1 w-full rounded-md" />
              <label className="block font-medium text-sm text-gray-600 w-full">Create Profile</label>
              <hr className="border-gray-300 border-1 w-full rounded-md" />
            </div>

            <div className="mt-7">
              <input
                type="text"
                onChange={e => setHandle(e.target.value)}
                placeholder="Enter Handle"
                className="mt-1 p-2 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
              />
              {errorTakenHandle ? (
                <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                  Handle Already Taken !
                </span>
              ) : (
                <></>
              )}
            </div>

            <div className="mt-7 mb-4">
              <button
                onClick={() => createProfile()}
                className="bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105"
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
