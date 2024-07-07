import { arbitrumSepolia, baseSepolia } from "viem/chains";

export const USDC_ADDRESS: { [chainId: number]: `0x${string}` } = {
  [baseSepolia.id]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  [arbitrumSepolia.id]: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
};

export const CROSSCHAIN_TRANSFER_CONTRACT_BASE_SEPOLIA = "0x480A24B3F71f8704066211e61CF6CCE430B8a5c7";

export const BASE_SEPOLIA_BLOCKSCOUT_TX_BASE_URL = "https://base-sepolia.blockscout.com/tx/";
