/* eslint-disable @typescript-eslint/no-non-null-assertion */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable prettier/prettier */
// app/safe/index.tsx
"use client";

import { useDynamicContext} from "@dynamic-labs/sdk-react-core";
import { createWalletClientFromWallet } from "@dynamic-labs/viem-utils";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useEthersV5Provider } from "~~/hooks/scaffold-eth/use-ethers-v5-provider";
import { useEthersV5Signer } from "~~/hooks/scaffold-eth/use-ethers-v5-signer";
import { getPimlicoSmartAccountClient, transferERC20 } from "~~/lib/permissionless";

const SafePage = () => {
  const { address, chain } = useAccount();

  const provider = useEthersV5Provider({ chainId: chain?.id }); //public client
  const signer = useEthersV5Signer({ chainId: chain?.id }); //wallet client
  const {primaryWallet} = useDynamicContext();
  console.log(primaryWallet, "primaryWallet");

  const [safeDeployed, setSafeDeployed] = useState(false);
  const [safeAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeploySafe = async () => {
    setLoading(true);
    setError(null);
    try {
      const userAddress = address! as `0x${string}`;
      if (!primaryWallet) return;
      const walletClient = await createWalletClientFromWallet(primaryWallet);
      await getPimlicoSmartAccountClient(userAddress, chain!, walletClient); //TODO
      setSafeDeployed(true);
    } catch (err) {
      setError("Failed to deploy Safe account.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleERC20Transfer = async () => {
    setLoading(true);
    setError(null);
    try {
      const userAddress = address! as `0x${string}`;
      if (!primaryWallet) return;
      const walletClient = await createWalletClientFromWallet(primaryWallet);
      console.log(walletClient, "walletClient");
      const smartAccountClient = await getPimlicoSmartAccountClient(userAddress, chain!, walletClient); 
      console.log(smartAccountClient, "smartAccountClient");
      const txHash = await transferERC20(
        "0x036CbD53842c5426634e7929541eC2318f3dCF7e", //TODO: change
        smartAccountClient,
        BigInt(1* 10 ** 2), //TODO: change
        chain!,
        "0xC103F2847Ed5EDBFF2666d19CabEd49fF0d3821a" //TODO: change
      );
      console.log("Transfer successful. Transaction hash:", txHash);
    } catch (err) {
      setError("Failed to transfer tokens.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Safe Smart Wallet</h1>
        <p className="text-lg mb-8">This is your Safe Smart Wallet page.</p>
        {safeDeployed ? (
          <>
            <p>Safe account already deployed!</p>
            {safeAddress && <p>Your Safe Address: {safeAddress}</p>}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleERC20Transfer}
            >
              Clickable Only If Safe Deployed
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleDeploySafe}
              disabled={loading}
            >
              {loading ? "Deploying..." : "Deploy Safe Smart Wallet"}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default SafePage;
