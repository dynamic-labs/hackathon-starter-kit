import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { getOrMapViemChain } from "@dynamic-labs/ethereum-core";
import { Wallet } from "@dynamic-labs/sdk-react-core";
import { NetworkConfigurationMap } from "@dynamic-labs/types";
import { Hex, parseEther } from "viem";
import { notification } from "~~/utils/scaffold-eth";

export const signMessage = async (message: string, wallet: any): Promise<string> => {
  const connector = wallet?.connector;

  return await connector.signMessage(message);
};

export const sendTransaction = async (
  address: any,
  amount: string,
  wallet: Wallet,
  networkConfigurations: NetworkConfigurationMap,
): Promise<string | undefined> => {
  try {
    if (!isEthereumWallet(wallet)) {
      throw new Error("Wallet is not an Ethereum wallet");
    }

    const walletClient = await wallet.getWalletClient();

    const chainID = await wallet.connector.getNetwork();
    const currentNetwork = networkConfigurations.evm?.find(network => network.chainId === chainID);

    if (!currentNetwork) {
      throw new Error("Network not found");
    }

    const chain = getOrMapViemChain({
      ...currentNetwork,
      chainId: Number(currentNetwork.chainId),
    });

    const transaction = {
      account: wallet.address as Hex,
      to: address as Hex,
      chain,
      value: amount ? parseEther(amount) : undefined,
    };

    const transactionHash = await walletClient.sendTransaction(transaction);
    return transactionHash;
  } catch (e) {
    if (e instanceof Error) {
      notification.error(`Error sending transaction: ${e.message}`);
    } else {
      notification.error("Error sending transaction");
    }
  }
};
