"use client";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider, mergeNetworks } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();

  /**
   * For more information on the `evmNetworks` object, see:
   * https://docs.dynamic.xyz/chains/evmNetwork#custom-evm-networks-evmnetwork
   */

  const customEvmNetworks = [
    {
      blockExplorerUrls: ["https://explorer-holesky.morphl2.io/"],
      chainId: 2810,
      name: "Morph",
      rpcUrls: ["https://rpc-quicknode-holesky.morphl2.io"],
      iconUrls: ["https://avatars.githubusercontent.com/u/132543920?v=4"],
      nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
      networkId: 2810,
    },
    {
      blockExplorerUrls: ["https://explorer.zircuit.com"],
      chainId: 48899,
      name: "Zircuit Testnet",
      rpcUrls: ["https://zircuit1.p2pify.com/"],
      iconUrls: ["https://pbs.twimg.com/profile_images/1774812048683143168/gSbmfQfa_400x400.jpg"],
      nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
      networkId: 48899,
    },
    {
      blockExplorerUrls: ["https://explorer.zero.network"],
      chainId: 4457845,
      name: "ZERϴ",
      rpcUrls: ["https://rpc.zerion.io/v1/zero-sepolia"],
      iconUrls: ["https://pbs.twimg.com/profile_images/1805906049213329408/oZFUGW9L_400x400.jpg"],
      nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
      networkId: 4457845,
    },
    {
      blockExplorerUrls: ["https://explorer.testnet.rsk.co"],
      chainId: 31,
      name: "RSK Testnet",
      rpcUrls: ["https://public-node.testnet.rsk.co"],
      iconUrls: ["https://rootstock.io/icons/icon-512x512.png?v=d5199ca8e8f274bc01b19fe9024f128e"],
      nativeCurrency: {
        name: "Rootstock Bitcoin",
        symbol: "tRBTC",
        decimals: 18,
      },
      networkId: 31,
    },
    {
      blockExplorerUrls: ["https://explorer.rsk.co"],
      chainId: 30,
      name: "RSK Mainnet",
      rpcUrls: ["https://public-node.rsk.co"],
      iconUrls: ["https://rootstock.io/icons/icon-512x512.png?v=d5199ca8e8f274bc01b19fe9024f128e"],
      nativeCurrency: {
        name: "Rootstock Bitcoin",
        symbol: "tRBTC",
        decimals: 18,
      },
      networkId: 30,
    },
  ];

  const evmNetworks = [
    ...scaffoldConfig.targetNetworks.map(chain => ({
      blockExplorerUrls: chain.blockExplorers
        ? Object.values(chain.blockExplorers as any).map(({ url }: any) => url)
        : [],
      chainId: chain.id,
      name: chain.name,
      rpcUrls: Object.values(chain.rpcUrls).map(({ http }) => http[0]),
      iconUrls: [],
      nativeCurrency: chain.nativeCurrency,
      networkId: chain.id,
    })),
    ...customEvmNetworks,
  ];

  return (
    <DynamicContextProvider
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      settings={{
        environmentId: scaffoldConfig.dynamicEnvId,
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          evmNetworks: networks => mergeNetworks(evmNetworks, networks),
        },
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <ProgressBar />

            <ScaffoldEthApp>{children}</ScaffoldEthApp>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
};
