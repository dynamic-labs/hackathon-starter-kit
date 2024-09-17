import { getOrMapViemChain } from "@dynamic-labs/ethereum-core";
import { Chain, createClient, http } from "viem";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  hardhat,
  mainnet,
  polygon,
  polygonAmoy,
  scroll,
  scrollSepolia,
  sepolia,
} from "viem/chains";
import { createConfig } from "wagmi";
import { customEvmNetworks } from "~~/lib/networks";
import scaffoldConfig from "~~/scaffold.config";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export const wagmiConfig = createConfig({
  chains: [
    arbitrum,
    arbitrumSepolia,
    base,
    baseSepolia,
    mainnet,
    polygon,
    polygonAmoy,
    scroll,
    scrollSepolia,
    sepolia,
    hardhat,
    ...customEvmNetworks.map(getOrMapViemChain),
  ],
  ssr: true,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(getAlchemyHttpUrl(chain.id)),
      ...(chain.id !== (hardhat as Chain).id
        ? {
            pollingInterval: scaffoldConfig.pollingInterval,
          }
        : {}),
    });
  },
});
