/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Chain, WalletClient, createPublicClient, http } from "viem"
import {
    ENTRYPOINT_ADDRESS_V07, 
    createSmartAccountClient, 
    walletClientToSmartAccountSigner
} from "permissionless"
import { 
    signerToSafeSmartAccount 
} from "permissionless/accounts"
import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from "permissionless/clients/pimlico"
import { ERC20_ABI } from "./erc20_abi"

const transportUrl = (chain: Chain) =>
    `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`;

  export const publicClient = (chain: Chain) => createPublicClient({
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

  //------

  export const getPimlicoSmartAccountClient = async (
    address: `0x${string}`,
    chain: Chain,
    walletClient: WalletClient //-> wallet: EmbeddedWalletState
  ) => {
    //const walletClient = getWalletClient(address, chain, wallet);
    //const signer = walletClientToSmartAccountSigner(walletClient);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    console.log("walletClient", walletClient);
    const signer = walletClientToSmartAccountSigner(walletClient as any);
    console.log("signer", signer);
  
    const safeSmartAccountClient = await signerToSafeSmartAccount(
      publicClient(chain),
      {
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        signer: signer,
        safeVersion: "1.4.1"
      }
    );
  
    return createSmartAccountClient({
      account: safeSmartAccountClient,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      chain,
      bundlerTransport: http(transportUrl(chain)),
      middleware: {
        //gasPrice: async () =>
          //(await pimlicoBundlerClient(chain).getUserOperationGasPrice()).fast, // use pimlico bundler to get gas prices
        sponsorUserOperation: paymasterClient(chain).sponsorUserOperation, // optional
      },
    });
  };

  export const transferERC20 = async (
    tokenAddress: string,
    smartAccountClient: any,
    amount: bigint,
    chain: Chain,
    toAddress: string
  ) => {
    console.log(amount, "amount")
    return await smartAccountClient.writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [toAddress, "100"],
    });
 };