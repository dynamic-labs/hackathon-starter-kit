import { getOrMapViemChain } from "@dynamic-labs/viem-utils";
import { Chain, createClient, http } from "viem";
import { baseSepolia, hardhat, mainnet } from "viem/chains";
import { createConfig } from "wagmi";
import { customEvmNetworks } from "~~/lib/networks";
import scaffoldConfig from "~~/scaffold.config";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

export const wagmiConfig = createConfig({
  chains: [baseSepolia, mainnet, ...customEvmNetworks.map(getOrMapViemChain)],
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
