"use client";

import Link from "next/link";
import { LensProvider, development } from "@lens-protocol/react-web";
import { LensConfig } from "@lens-protocol/react-web";
import { bindings } from "@lens-protocol/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { WagmiProvider, createConfig, http } from "wagmi";
import { avalancheFuji, polygonAmoy, sepolia } from "wagmi/chains";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const queryClient = new QueryClient();

  const wagmiConfig = createConfig({
    chains: [polygonAmoy, sepolia, avalancheFuji],
    transports: {
      [polygonAmoy.id]: http(),
      [sepolia.id]: http(),
      [avalancheFuji.id]: http(),
    },
  });
  const lensConfig: LensConfig = {
    bindings: bindings(wagmiConfig),
    environment: development,
  };
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <LensProvider config={lensConfig}>
          <div className="relative h-[70vh] md:min-h-screen flex flex-col">
            <div className="absolute h-1/4 w-full top-0 left-0 hero-top-gradient"></div>
            <div
              className="bg-[#EFFBCA] bg-cover md:bg-center bg-[position:40%_0] flex-grow"
              style={{ backgroundImage: "url(/assets/hero.jpg)" }}
            >
              <div className="flex justify-center">
                <h1 className="text-center z-10 font-bold font-mono text-4xl max-w-xs lg:text-3xl lg:mt-8 lg:max-w-4xl px-3 text-white">
                  Unleash Stories, Empower Creators{" "}
                </h1>
              </div>
            </div>
          </div>

          {/* Start Using FairPlayXI */}
          <div className="bg-base-100" id="start-using-fairplayxi">
            <div className="container max-w-[90%] lg:max-w-6xl m-auto py-12 lg:py-20 lg:px-12 flex flex-col lg:flex-row items-center gap-5 lg:gap-0">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-5xl lg:w-3/4 text-center lg:text-left">
                  Start Using TaleVault For Content Trading 
                </h2>
                <ul className="list-disc list-inside flex flex-col space-y-3 m-auto lg:mx-0 max-w-[300px] lg:max-w-none">
                  <li>
                    <span className="font-bold">Tokenized Narratives</span> - Transform stories into tradable digital assets on the blockchain
                  </li>
                  <li>
                    <span className="font-bold">Secure Transactions</span> - Leverage smart contracts for transparent and trustless exchanges
                  </li>
                  <li>
                    <span className="font-bold">Creator Empowerment</span> - Enable writers and content creators to monetize their work directly
                  </li>
                </ul>
                <div className="text-center lg:text-left">
                  <Link id="play-now" href="/tales" className="btn btn-outline lg:self-start px-8 hover:opacity-100">
                    Trade Now!
                  </Link>
                </div>
              </div>
              <div className="max-w-[300px] lg:max-w-none">
                <img src="/logo.png" alt="hero" width={500} height={500} />
              </div>
            </div>
            <div className="bg-[url(/assets/sre-path.png)] bg-repeat-x h-32 relative bg-[35%_top]"></div>
          </div>
        </LensProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Home;
