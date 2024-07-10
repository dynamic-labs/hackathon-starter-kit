"use client";

import { useState } from "react";
import Link from "next/link";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { sendTransaction, signMessage } from "~~/lib/dynamic";

const Home: NextPage = () => {
  const { primaryWallet, networkConfigurations } = useDynamicContext();
  const [messageSignature, setMessageSignature] = useState<string>("");
  const [transactionSignature, setTransactionSignature] = useState<string>("");
  const connectedAddress = primaryWallet?.address;

  const handleSignMesssage = async () => {
    try {
      const signature = await signMessage("Hello World", primaryWallet);
      setMessageSignature(signature);

      setTimeout(() => {
        setMessageSignature("");
      }, 10000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendTransaction = async () => {
    try {
      const isTestnet = await primaryWallet?.connector?.isTestnet();
      if (!isTestnet) {
        alert("You're not on a testnet, proceed with caution.");
      }
      const hash = await sendTransaction(connectedAddress, "0.0001", primaryWallet, networkConfigurations);
      setTransactionSignature(hash);

      setTimeout(() => {
        setTransactionSignature("");
      }, 10000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          {primaryWallet && !transactionSignature && (
            <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
              <button onClick={() => handleSendTransaction()} className="btn btn-primary">
                Send 0.001 ETH to yourself
              </button>
              <button onClick={() => handleSignMesssage()} className="btn btn-primary">
                Sign Hello World
              </button>
            </div>
          )}
          {primaryWallet && messageSignature && (
            <p className="text-center-text-lg">Message signed! {messageSignature}</p>
          )}
          {primaryWallet && transactionSignature && (
            <p className="text-center-text-lg">Transaction processed! {transactionSignature}</p>
          )}
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
