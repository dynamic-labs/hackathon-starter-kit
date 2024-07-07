import { useMemo } from "react";
import { providers } from "ethers";
import { WalletClient } from "viem";
import { useWalletClient } from "wagmi";

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  if (!account || !chain || !transport) throw new Error("Invalid wallet client");
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersV5Signer({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return useMemo(() => (walletClient ? walletClientToSigner(walletClient) : undefined), [walletClient]);
}
