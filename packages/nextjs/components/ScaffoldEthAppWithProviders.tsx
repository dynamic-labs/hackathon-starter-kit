"use client";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
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
  const evmNetworks = scaffoldConfig.targetNetworks.map(chain => ({
    blockExplorerUrls: chain.blockExplorers
      ? Object.values(chain.blockExplorers as any).map(({ url }: any) => url)
      : [],
    chainId: chain.id,
    name: chain.name,
    rpcUrls: Object.values(chain.rpcUrls).map(({ http }) => http[0]),
    iconUrls: [],
    nativeCurrency: chain.nativeCurrency,
    networkId: chain.id,
  }));

  return (
    <DynamicContextProvider
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      settings={{
        environmentId: scaffoldConfig.dynamicEnvId,
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          evmNetworks,
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
