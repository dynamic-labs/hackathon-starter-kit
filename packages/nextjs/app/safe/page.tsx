// app/safe/index.tsx
"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useEthersV5Provider } from "~~/hooks/scaffold-eth/use-ethers-v5-provider";
import { useEthersV5Signer } from "~~/hooks/scaffold-eth/use-ethers-v5-signer";
import { deploySafe } from "~~/lib/deploy-safe";

// app/safe/index.tsx

// app/safe/index.tsx

// app/safe/index.tsx

// app/safe/index.tsx

// app/safe/index.tsx

// app/safe/index.tsx

// app/safe/index.tsx

// app/safe/index.tsx

// app/safe/index.tsx

// app/safe/index.tsx

const SafePage = () => {
  const { address, chain } = useAccount();

  const provider = useEthersV5Provider({ chainId: chain?.id });
  console.log("provider", provider);
  const signer = useEthersV5Signer({ chainId: chain?.id });
  console.log("signer", signer);

  const [safeDeployed, setSafeDeployed] = useState(false);
  const [safeAddress, setSafeAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeploySafe = async () => {
    setLoading(true);
    setError(null);
    try {
      const userAddress = address!;
      const safeAddr = await deploySafe({ provider: "provider", signer: "signer", userAddress }); //TODO: change this
      setSafeAddress(safeAddr);
      setSafeDeployed(true);
    } catch (err) {
      setError("Failed to deploy Safe account.");
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
