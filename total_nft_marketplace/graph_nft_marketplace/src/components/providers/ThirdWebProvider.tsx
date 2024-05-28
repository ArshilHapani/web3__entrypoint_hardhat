"use client";

import { ThirdwebProvider } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
};
const ThirdWebProviderComponent = ({ children }: Props) => {
  const [appolloClient] = useState(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        uri: process.env.NEXT_PUBLIC_APPOLLO_CLIENT_URI,
      })
  );
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <ThirdwebProvider
      activeChain="ethereum"
      theme="light"
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      <ApolloProvider client={appolloClient}>{children}</ApolloProvider>
      <Toaster position="top-right" />
    </ThirdwebProvider>
  );
};

export default ThirdWebProviderComponent;
