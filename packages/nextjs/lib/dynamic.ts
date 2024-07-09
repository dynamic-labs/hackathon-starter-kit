import { Wallet } from "@dynamic-labs/sdk-react-core";
import { getOrMapViemChain } from "@dynamic-labs/viem-utils";
import { Account, Chain, Hex, Transport, WalletClient, parseEther } from "viem";
import { customEvmNetworks } from "~~/lib/networks";

export const signMessage = async (message: string, wallet: any): Promise<string> => {
  const connector = wallet?.connector;

  return await connector.signMessage(message);
};

export const sendTransaction = async (address: any, amount: string, wallet: Wallet): Promise<string> => {
  const walletClient = wallet.connector.getWalletClient<WalletClient<Transport, Chain, Account>>();

  const chainID = await wallet.connector.getNetwork();
  const currentNetwork = customEvmNetworks.find(network => network.chainId === chainID);

  if (!currentNetwork) {
    throw new Error("No chain ID found");
  }

  const chain = getOrMapViemChain(currentNetwork);

  const transaction = {
    account: wallet.address as Hex,
    to: address as Hex,
    chain,
    value: amount ? parseEther(amount) : undefined,
  };

  const transactionHash = await walletClient.sendTransaction(transaction);
  return transactionHash;
};
