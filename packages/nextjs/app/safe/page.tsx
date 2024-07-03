// app/safe/index.tsx

//import { useAccount } from "wagmi";
//import { useEthersV5Provider } from "~~/hooks/scaffold-eth/use-ethers-v5-provider";
//import { useEthersV5Signer } from "~~/hooks/scaffold-eth/use-ethers-v5-signer";

const SafePage = () => {
  // const {address, chain} = useAccount();

  // const provider = useEthersV5Provider({ chainId: chain?.id });
  // const signer = useEthersV5Signer({ chainId: chain?.id });

  // Logic to determine if Safe account is deployed
  const safeDeployed = true; // Replace with actual logic to check if Safe account is deployed

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Safe Smart Wallet</h1>
        <p className="text-lg mb-8">This is your Safe Smart Wallet page.</p>
        {safeDeployed ? (
          <p>Safe account already deployed!</p>
        ) : (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={safeDeployed}
          >
            Deploy Safe Smart Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default SafePage;
