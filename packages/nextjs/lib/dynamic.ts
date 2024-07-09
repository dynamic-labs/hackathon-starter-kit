import { getChain } from "@dynamic-labs/viem-utils";
import { Account, Chain, Hex, Transport, WalletClient, parseEther } from "viem";

export const signMessage = async (message: string, wallet: any): Promise<string> => {
  if (!wallet) {
    throw new Error("No wallet found");
  }

  const connector = wallet?.connector;

  if (!connector) {
    throw new Error("No connector found");
  }

  return await connector.signMessage(message);
};

export const sendTransaction = async (address: any, amount: string, wallet: any): Promise<string> => {
  if (!wallet) {
    throw new Error("No wallet found");
  }

  const connector = wallet?.connector;

  if (!connector) {
    return "No connector found";
  }

  const provider: WalletClient<Transport, Chain, Account> = await wallet.connector.getSigner();

  if (!provider) {
    return "No provider found";
  }

  const transaction = {
    account: wallet.address as Hex,
    chain: getChain(await provider.getChainId()),
    to: address as Hex,
    value: amount ? parseEther(amount) : undefined,
  };

  const transactionHash = await provider.sendTransaction(transaction);

  return transactionHash;
};
