/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { ERC20_ABI, ERC20_CROSSCHAIN_TRANSFER_ABI } from "./ABI";
import { CROSSCHAIN_TRANSFER_CONTRACT_BASE_SEPOLIA } from "./constants";
import { ENTRYPOINT_ADDRESS_V07, createSmartAccountClient, walletClientToSmartAccountSigner } from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import { Chain, WalletClient, createPublicClient, encodeFunctionData, http } from "viem";

const transportUrl = (chain: Chain) =>
  `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`;

export const publicClient = (chain: Chain) =>
  createPublicClient({
    transport: http(chain?.rpcUrls.default.http[0].toString()),
  });

export const paymasterClient = (chain: Chain) =>
  createPimlicoPaymasterClient({
    transport: http(transportUrl(chain)),
    entryPoint: ENTRYPOINT_ADDRESS_V07,
  });

export const pimlicoBundlerClient = (chain: Chain) =>
  createPimlicoBundlerClient({
    transport: http(transportUrl(chain)),
    entryPoint: ENTRYPOINT_ADDRESS_V07,
  });

export const getPimlicoSmartAccountClient = async (
  address: `0x${string}`,
  chain: Chain,
  walletClient: WalletClient, //-> wallet: EmbeddedWalletState
) => {
  const signer = walletClientToSmartAccountSigner(walletClient as any);

  const safeSmartAccountClient = await signerToSafeSmartAccount(publicClient(chain), {
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    signer: signer,
    safeVersion: "1.4.1",
  });

  return createSmartAccountClient({
    account: safeSmartAccountClient,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    chain,
    bundlerTransport: http(transportUrl(chain)),
    middleware: {
      gasPrice: async () => (await pimlicoBundlerClient(chain).getUserOperationGasPrice()).fast, // use pimlico bundler to get gas prices
      sponsorUserOperation: paymasterClient(chain).sponsorUserOperation, // optional
    },
  });
};
export const approveERC20 = async (smartAccountClient: any, tokenAddress: string, amount: bigint, spender: string) => {
  return await smartAccountClient.writeContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [spender, amount.toString()],
  });
};

export const transferERC20 = async (
  smartAccountClient: any,
  tokenAddress: string,
  amount: bigint,
  toAddress: string,
) => {
  return await smartAccountClient.writeContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [toAddress, amount.toString()],
  });
};

export const crossChainTransferERC20 = async (
  smartAccountClient: any,
  tokenAddress: string,
  amount: bigint,
  receiver: string,
) => {
  const destChainSelector = "3478487238524512106"; //https://docs.chain.link/ccip/supported-networks/v1_2_0/testnet#base-sepolia-arbitrum-sepolia

  return await smartAccountClient.writeContract({
    address: CROSSCHAIN_TRANSFER_CONTRACT_BASE_SEPOLIA,
    abi: ERC20_CROSSCHAIN_TRANSFER_ABI,
    functionName: "transferTokensPayNative",
    args: [destChainSelector, receiver, tokenAddress, amount.toString()],
  });
};
