"use client";

import { useState } from "react";
import { ExternalLinkIcon, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createWalletClientFromWallet } from "@dynamic-labs/viem-utils";
import { formatUnits } from "viem";
import { baseSepolia } from "viem/chains";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { ERC20_ABI } from "~~/lib/ABI";
import { TransactionDetails, getTransactionOnBaseSepoliaByHash } from "~~/lib/blockscout";
import {
  BASE_SEPOLIA_BLOCKSCOUT_TX_BASE_URL,
  CROSSCHAIN_TRANSFER_CONTRACT_BASE_SEPOLIA,
  USDC_ADDRESS,
} from "~~/lib/constants";
import { toMinsAgo } from "~~/lib/date-utils";
import {
  approveERC20,
  crossChainTransferERC20,
  getPimlicoSmartAccountClient,
  transferERC20,
} from "~~/lib/permissionless";

const SafePage = () => {
  const { address, chain, isConnected } = useAccount();
  const { primaryWallet, isAuthenticated } = useDynamicContext();

  const [safeDeployed, setSafeDeployed] = useState(false);
  const [safeAddress, setSafeAddress] = useState<string | null>("");

  const [transactions, setTransactions] = useState<string[]>([]);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails[]>([]); // TransactionDetails[
  const [refreshingTransactions, setRefreshingTransactions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [crossChainTransferAmount, setCrossChainTransferAmount] = useState<number>(0);
  const [crossChainTransferTokenAddress] = useState<string>(USDC_ADDRESS[baseSepolia.id]);
  const [crossChainRecipientAddress, setCrossChainRecipientAddress] = useState<string>("");
  const [transferTokenAddress, setTransferTokenAddress] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { data: safeBalance, refetch: refetchSafeBalance } = useBalance({
    address: (safeAddress || ("" as `0x${string}`)) as `0x${string}`,
    chainId: chain?.id,
  });

  const { data: safeUSDCBalance, refetch: refetchSafeUSDCBalance } = useReadContract({
    abi: ERC20_ABI,
    address: chain ? USDC_ADDRESS[chain?.id] : ("" as `0x${string}`),
    functionName: "balanceOf",
    args: [safeAddress],
  });

  const handleDeploySafe = async () => {
    setLoading(true);
    setError(null);
    try {
      const userAddress = address as `0x${string}`;
      if (!primaryWallet || !chain) return;
      const walletClient = await createWalletClientFromWallet(primaryWallet);
      const { account } = await getPimlicoSmartAccountClient(userAddress, chain, walletClient);
      setSafeAddress(account.address);
      setSafeDeployed(true);
      refetchSafeBalance();
      refetchSafeUSDCBalance();
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
      const userAddress = address as `0x${string}`;
      if (!primaryWallet || !chain) return;
      const walletClient = await createWalletClientFromWallet(primaryWallet);
      const smartAccountClient = await getPimlicoSmartAccountClient(userAddress, chain, walletClient);
      const txHash = await transferERC20(
        smartAccountClient,
        transferTokenAddress,
        BigInt(transferAmount * 10 ** 6),
        recipientAddress,
      );
      setTransactions([...transactions, txHash]);
      const transactionDetail = await getTransactionOnBaseSepoliaByHash(txHash);
      setTransactionDetails([...transactionDetails, transactionDetail]);
    } catch (err) {
      setError("Failed to transfer tokens.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshTransactions = async () => {
    setRefreshingTransactions(true);
    setTransactionDetails([]);
    const txDetails = [];
    for (const txHash of transactions) {
      const transactionDetail = await getTransactionOnBaseSepoliaByHash(txHash);
      txDetails.push(transactionDetail);
      setTransactionDetails(txDetails);
    }
    setRefreshingTransactions(false);
  };

  const handleERC20CrossChainTransfer = async () => {
    setLoading(true);
    setError(null);
    try {
      const userAddress = address as `0x${string}`;
      if (!primaryWallet || !chain) return;
      const walletClient = await createWalletClientFromWallet(primaryWallet);
      const smartAccountClient = await getPimlicoSmartAccountClient(userAddress, chain, walletClient);
      const approveHash = await approveERC20(
        smartAccountClient,
        crossChainTransferTokenAddress,
        BigInt(crossChainTransferAmount * 10 ** 6),
        CROSSCHAIN_TRANSFER_CONTRACT_BASE_SEPOLIA,
      );
      console.log("approveHash", approveHash);

      const txHash = await crossChainTransferERC20(
        smartAccountClient,
        crossChainTransferTokenAddress,
        BigInt(crossChainTransferAmount * 10 ** 6),
        crossChainRecipientAddress,
      );
      console.log("txHash", txHash);
      setTransactions([...transactions, txHash]);
      const transactionDetail = await getTransactionOnBaseSepoliaByHash(txHash);
      setTransactionDetails([...transactionDetails, transactionDetail]);
    } catch (err) {
      setError("Failed to transfer tokens.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const canTransfer = transferAmount > 0 && transferTokenAddress && recipientAddress;
  const canCrossChainTransfer =
    crossChainTransferAmount > 0 && crossChainRecipientAddress && crossChainTransferTokenAddress;

  const copyToClipboard = (s: string) => {
    navigator.clipboard.writeText(s);
  };

  return (
    <div className="flex flex-col items-center h-screen gap-4 p-12">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Safe Smart Wallet</h1>
        <p className="text-lg">
          This example deploys a <span className="font-semibold">Safe Smart Wallet</span> and then executes gasless
          transactions using <span className="font-semibold">Pimlico</span>&apos;s paymaster.
        </p>
        <div className="flex flex-row gap-2">
          <a href="https://docs.safe.global/home/what-is-safe" target="_blank">
            <button className="btn btn-neutral btn-outline btn-sm">
              Learn more about Safe
              <ExternalLinkIcon />
            </button>
          </a>
          <a href="https://docs.pimlico.io/" target="_blank">
            <button className="btn btn-neutral btn-outline btn-sm">
              Learn more about Pimlico
              <ExternalLinkIcon />
            </button>
          </a>
        </div>
      </div>

      {safeDeployed ? (
        <div className="flex flex-col justify-center items-center gap-4">
          <div role="alert" className="alert w-fit border border-white">
            <div className="flex flex-row items-center gap-2">
              <div>
                <div className="flex flex-row items-center gap-2">
                  <CheckCircleIcon className="w-6 h-6" />
                  <div className="font-bold text-lg">Safe Smart Wallet deployed!</div>
                </div>
                <div className="flex flex-row items-center gap-4">
                  <p>Address: {safeAddress}</p>
                  {safeAddress && (
                    <div
                      className="flex flex-row items-center gap-1  cursor-pointer hover:text-warning"
                      onClick={() => copyToClipboard(safeAddress)}
                    >
                      <ClipboardIcon className="w-4 h-4" />
                      <p className="text-xs">Copy</p>
                    </div>
                  )}
                </div>
                {safeBalance && <div>Balance ETH: {formatUnits(safeBalance.value, safeBalance.decimals)} $ETH</div>}
                {(safeUSDCBalance as bigint) >= 0n && (
                  <div>Balance USDC: {formatUnits(safeUSDCBalance as bigint, 6)} $USDC</div>
                )}
              </div>
            </div>
          </div>
          <div role="tablist" className="tabs tabs-bordered w-full">
            <input type="radio" name="my_tabs_1" role="tab" className="tab w-full" aria-label="ERC20 Transfer" />
            <div role="tabpanel" className="tab-content p-10 w-full">
              <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex flex-col gap-4 items-center justify-center w-full">
                  {chain && (
                    <div className="btn btn-outline btn-xs" onClick={() => copyToClipboard(USDC_ADDRESS[chain.id])}>
                      <ClipboardIcon className="w-4 h-4" />
                      USDC Address
                    </div>
                  )}

                  <label className="input input-bordered flex items-center gap-2 w-full">
                    <span className="font-medium">Token Address</span>
                    <input
                      type="text"
                      className="grow bg-transparent"
                      placeholder="0x1aB..."
                      value={transferTokenAddress}
                      onChange={e => setTransferTokenAddress(e.target.value)}
                    />
                  </label>
                  <label className="input input-bordered flex items-center gap-2 w-full">
                    <span className="font-medium">Amount</span>
                    <input
                      type="number"
                      className="grow bg-transparent"
                      placeholder="0"
                      value={transferAmount}
                      onChange={e => setTransferAmount(Number(e.target.value))}
                    />
                  </label>
                  <label className="input input-bordered flex items-center gap-2 w-full">
                    <span className="font-medium">Recipient Address</span>
                    <input
                      type="text"
                      className="grow bg-transparent"
                      placeholder="0x1aB..."
                      value={recipientAddress}
                      onChange={e => setRecipientAddress(e.target.value)}
                    />
                  </label>
                  <div className="flex flex-col gap-1">
                    <button className="btn btn-success" onClick={handleERC20Transfer} disabled={!canTransfer}>
                      {loading ? (
                        <>
                          <span className="loading loading-spinner"></span>Sending...
                        </>
                      ) : (
                        "Send transaction"
                      )}
                    </button>
                    <p className="text-warning text-xs">
                      Make sure to have enough balance in the Safe account and the recipient address is valid.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <input
              type="radio"
              name="my_tabs_1"
              role="tab"
              className="tab  w-full"
              aria-label="Crosschain USDC Transfer"
            />
            <div role="tabpanel" className="tab-content p-10  w-full">
              <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex flex-col gap-4 items-center justify-center w-full">
                  <p className="text-warning text-xs">
                    This crosschain transfer supports only USDC from Base Sepolia to Arbitrum Sepolia
                  </p>
                  <label className="input input-bordered flex items-center gap-2 w-full">
                    <span className="font-medium">USDC Address</span>
                    <input
                      type="text"
                      className="grow bg-transparent"
                      placeholder="0x1aB..."
                      value={crossChainTransferTokenAddress}
                      disabled={true}
                    />
                  </label>
                  <label className="input input-bordered flex items-center gap-2 w-full">
                    <span className="font-medium">Amount</span>
                    <input
                      type="number"
                      className="grow bg-transparent"
                      placeholder="0"
                      value={crossChainTransferAmount}
                      onChange={e => setCrossChainTransferAmount(Number(e.target.value))}
                    />
                  </label>
                  <label className="input input-bordered flex items-center gap-2 w-full">
                    <span className="font-medium">Recipient Address</span>
                    <input
                      type="text"
                      className="grow bg-transparent"
                      placeholder="0x1aB..."
                      value={crossChainRecipientAddress}
                      onChange={e => setCrossChainRecipientAddress(e.target.value)}
                    />
                  </label>
                  <div className="flex flex-col gap-1">
                    <button
                      className="btn btn-success"
                      onClick={handleERC20CrossChainTransfer}
                      disabled={!canCrossChainTransfer}
                    >
                      {loading ? (
                        <>
                          <span className="loading loading-spinner"></span>Sending...
                        </>
                      ) : (
                        "Send Crosschain transaction"
                      )}
                    </button>
                    <p className="text-warning text-xs">
                      Make sure to have enough balance in the Safe account and the recipient address is valid.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <input type="radio" name="my_tabs_1" role="tab" className="tab  w-full" aria-label="Transactions" />
            <div role="tabpanel" className="tab-content p-10  w-full">
              <div className="flex flex-col gap-4">
                <button className="btn btn-outline btn-sm w-fit" onClick={refreshTransactions}>
                  {refreshingTransactions ? (
                    <>
                      <span className="loading loading-spinner"></span>Refreshing...
                    </>
                  ) : (
                    "Refresh Transactions"
                  )}
                </button>
                {!refreshingTransactions && (
                  <div className="flex flex-col gap-1">
                    {transactionDetails.map(tx => (
                      <div className="flex flex-col gap-1" key={tx.hash}>
                        <div className="flex flex-row gap-8">
                          <a target="_blank" href={`${BASE_SEPOLIA_BLOCKSCOUT_TX_BASE_URL}/${tx.hash}`}>
                            <div className="flex flex-row gap-2 items-center">
                              {`${tx.hash.substring(0, 8)}...${tx.hash.substring(tx.hash.length - 8)}`}
                              <ExternalLinkIcon />
                            </div>
                          </a>
                          <div>{toMinsAgo(tx.timestamp)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <button
            className="btn btn-success"
            onClick={handleDeploySafe}
            disabled={loading || !isConnected || !isAuthenticated}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>Deploying...
              </>
            ) : isConnected && isAuthenticated ? (
              "Deploy Safe Account"
            ) : (
              "Connect Wallet first"
            )}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </>
      )}
    </div>
  );
};

export default SafePage;
