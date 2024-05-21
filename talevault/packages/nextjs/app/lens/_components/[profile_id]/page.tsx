"use client";

import React, { useEffect, useState } from "react";
import { LensClient, development } from "@lens-protocol/client";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

export default function Profile() {
  let handle = localStorage.getItem("handle");
  const [profileManager, setprofileManager] = useState(localStorage.getItem("profileManager"));
  const [followers, setFollowers] = useState([]);
  let profile_id = localStorage.getItem("profile_id");
  const { address } = useAccount();
  const lensClient = new LensClient({
    environment: development,
  });
  async function LoginAccount() {
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
    const isAuthenticated = await lensClient.authentication.isAuthenticated();
    console.log(isAuthenticated);
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
  async function checkFollowers() {
    // const isAuthenticated = await lensClient.authentication.isAuthenticated();
    // console.log(isAuthenticated);
    // if (isAuthenticated) {
    const result = await lensClient.profile.followers({
      of: profile_id ?? "",
    });
    setFollowers(result.items);
    console.log(
      `Followers:`,
      result.items.map(p => p.handle),
    );
    // }
  }

  useEffect(() => {
    checkFollowers();
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
          <nav className="flex-col flex-grow pb-4 md:pb-0 hidden md:flex md:justify-end md:flex-row">
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
          </nav>
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
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">{handle}</h1>
              {/* <h3 className="text-gray-600 font-lg text-semibold leading-6">Owner at Her Company Inc.</h3>
              <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, eligendi dolorum sequi illum qui
                unde aspernatur non deserunt
              </p> */}
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
                          <li className="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">
                            {follower.toString()}
                          </li>
                        );
                      })}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full md:w-9/12 mx-2 h-64">
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span className="text-green-500">
                  <svg
                    className="h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <span className="tracking-wide">About</span>
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">First Name</div>
                    <div className="px-4 py-2">Jane</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Last Name</div>
                    <div className="px-4 py-2">Doe</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Gender</div>
                    <div className="px-4 py-2">Female</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Contact No.</div>
                    <div className="px-4 py-2">+11 998001001</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Current Address</div>
                    <div className="px-4 py-2">Beech Creek, PA, Pennsylvania</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Permanant Address</div>
                    <div className="px-4 py-2">Arlington Heights, IL, Illinois</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Email.</div>
                    <div className="px-4 py-2">
                      <a className="text-blue-800" href="mailto:jane@example.com">
                        jane@example.com
                      </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Birthday</div>
                    <div className="px-4 py-2">Feb 06, 1998</div>
                  </div>
                </div>
              </div>
              <button className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">
                Show Full Information
              </button>
            </div>

            <div className="my-4"></div>

            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="grid grid-cols-2">
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span className="text-green-500">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </span>
                    <span className="tracking-wide">Experience</span>
                  </div>
                  <ul className="list-inside space-y-2">
                    <li>
                      <div className="text-teal-600">Owner at Her Company Inc.</div>
                      <div className="text-gray-500 text-xs">March 2020 - Now</div>
                    </li>
                    <li>
                      <div className="text-teal-600">Owner at Her Company Inc.</div>
                      <div className="text-gray-500 text-xs">March 2020 - Now</div>
                    </li>
                    <li>
                      <div className="text-teal-600">Owner at Her Company Inc.</div>
                      <div className="text-gray-500 text-xs">March 2020 - Now</div>
                    </li>
                    <li>
                      <div className="text-teal-600">Owner at Her Company Inc.</div>
                      <div className="text-gray-500 text-xs">March 2020 - Now</div>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span className="text-green-500">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path
                          fill="#fff"
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        />
                      </svg>
                    </span>
                    <span className="tracking-wide">Education</span>
                  </div>
                  <ul className="list-inside space-y-2">
                    <li>
                      <div className="text-teal-600">Masters Degree in Oxford</div>
                      <div className="text-gray-500 text-xs">March 2020 - Now</div>
                    </li>
                    <li>
                      <div className="text-teal-600">Bachelors Degreen in LPU</div>
                      <div className="text-gray-500 text-xs">March 2020 - Now</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
