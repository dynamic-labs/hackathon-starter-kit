"use client";

import { useEffect, useState } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./smartcontract";
import {
  ExternalLinkIcon,
  getNetwork,
  useDynamicContext,
  useIsLoggedIn,
  useSwitchNetwork,
  useWalletConnectorEvent,
} from "@dynamic-labs/sdk-react-core";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";
import { filecoinCalibration } from "viem/chains";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

const FVMPage = () => {
  const isLoggedIn = useIsLoggedIn();
  const { primaryWallet } = useDynamicContext();
  const switchNetwork = useSwitchNetwork();
  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const [network, setNetwork] = useState<number | null>(null);
  const [hostedLink, setHostedLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useWalletConnectorEvent(primaryWallet?.connector, "chainChange", async ({ chain }) => {
    setNetwork(parseInt(chain));
  });

  const fetchNetwork = async () => {
    if (!primaryWallet) return;
    const network = Number(await getNetwork(primaryWallet.connector));
    setNetwork(network);
  };

  useEffect(() => {
    fetchNetwork();
  }, [primaryWallet]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY) {
      notification.error("Please set NEXT_PUBLIC_LIGHTHOUSE_API_KEY in .env file.");
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setLoading(true);

    const apiKey = `${process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY}`;

    // When uploading a file, you can customize how it's stored in Lighthouse using the
    // below deal parameters

    const dealParams = {
      num_copies: 2,
      repair_threshold: 28800,
      renew_threshold: 240,
      miner: ["t017840"],
      network: "calibration",
      deal_duration: 2,
    };

    const uploadResponse = await lighthouse.upload(file, apiKey, dealParams);

    if (uploadResponse) {
      setHostedLink(`https://gateway.lighthouse.storage/ipfs/${uploadResponse.data.Hash}`);
      setStep(1);
    }
    setLoading(false);
  };

  const handleSubmitRaas = async () => {
    setIsSubmitting(true);
    try {
      const fileLinkBytes = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(hostedLink));
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "submitRaaS",
        args: [fileLinkBytes, 2, 4, 40],
      });
      setStep(2); // Move to step 3 after successful submission
    } catch (err) {
      setError("Failed to submit file.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center h-screen gap-4 p-12">
        {isLoggedIn && primaryWallet && network !== filecoinCalibration.id ? (
          <button
            className="btn btn-success"
            onClick={() => switchNetwork({ wallet: primaryWallet, network: filecoinCalibration.id })}
          >
            Switch to Filecoin Calibration
          </button>
        ) : (
          <div>
            {loading || isConfirming || isPending ? (
              <>
                <div className="flex flex-row gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
                  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </>
            ) : isLoggedIn && primaryWallet ? (
              <div className="flex flex-col items-center h-screen gap-4 p-12">
                {/* STEP 0 : Upload File to Lighthouse Storage */}
                {step == 0 && (
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold">Data Storage on FVM</h1>
                    <p className="text-lg">
                      This example covers the steps to upload a file on <span className="font-semibold">Filecoin </span>{" "}
                      via <span className="font-semibold">FVM </span>
                      using <span className="font-semibold">Lighthouse SDK</span>.
                    </p>
                    <div className="flex flex-row gap-2">
                      <a href="https://fvm.filecoin.io/" target="_blank">
                        <button className="btn btn-neutral btn-outline btn-sm">
                          Learn more about FVM
                          <ExternalLinkIcon />
                        </button>
                      </a>
                      <a href="https://docs.lighthouse.storage/lighthouse-1" target="_blank">
                        <button className="btn btn-neutral btn-outline btn-sm">
                          Learn more about Lighthouse.Storage
                          <ExternalLinkIcon />
                        </button>
                      </a>
                    </div>
                    <div className="flex items-center justify-center w-full mt-16">
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          onChange={e => handleFileUpload(e.target.files)}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* STEP 1 : Attaching a RaaS worker on-demand */}
                {step == 1 && (
                  <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
                    <div className="w-full h-64 mb-4 overflow-hidden rounded-lg">
                      <img className="w-full h-full object-contain" alt="Uploaded File" src={hostedLink} />
                    </div>
                    <div className="p-4 text-center">
                      <h2 className="text-xl font-semibold mb-4">RaaS - Renew, Repair, Replication</h2>
                      <p className="text-gray-600 mb-6">
                        In this section we interact with the smart contract on FVM Calibration network by submitting a
                        CID of the file we uploaded in previous section to the submitRaaS function. This will create a
                        new deal request that the Lighthouse RaaS Worker will pick up and initiate deals.
                      </p>
                      <div className="flex flex-col items-center mt-4">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 mb-4"
                          onClick={handleSubmitRaas}
                          disabled={isSubmitting || isPending}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Submitting...
                            </div>
                          ) : isPending ? (
                            "Waiting for transaction..."
                          ) : (
                            "Submit RaaS"
                          )}
                        </button>
                        {isPending && (
                          <p className="text-sm text-gray-600 mb-4">
                            Transaction submitted. Waiting for confirmation...
                          </p>
                        )}
                        <a href={hostedLink} target="_blank" rel="noopener noreferrer" className="mt-2">
                          <button className="btn btn-sm">
                            View File
                            <ExternalLinkIcon />
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Transaction Submitted, Waiting for Hash */}
                {step == 2 && (
                  <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Transaction Submitted Successfully</h2>
                    <p className="text-gray-600 mb-4">
                      Your RaaS submission has been processed. {!hash && "Waiting for transaction hash..."}
                    </p>
                    {hash ? (
                      <a
                        href={`https://calibration.filfox.info/en/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="btn btn-success">View Transaction On Explorer</button>
                      </a>
                    ) : (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                        <span>Waiting for transaction hash...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn-success" disabled={!isLoggedIn}>
                Connect Wallet
              </button>
            )}
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        )}
      </div>
    </>
  );
};

export default FVMPage;
