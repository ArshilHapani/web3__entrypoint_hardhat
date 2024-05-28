"use client";

import { WagmiProvider } from "wagmi";
import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import config from "../../../config";

type Props = {
  children: React.ReactNode;
};

const QueryClientProviderComponent = ({ children }: Props) => {
  const [client] = useState(() => new QueryClient());
  const [appolloClient] = useState(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        uri: process.env.NEXT_PUBLIC_APPOLLO_CLIENT_URI,
      })
  );
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <ApolloProvider client={appolloClient}>{children}</ApolloProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default QueryClientProviderComponent;
