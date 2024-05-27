"use client";

import { ThirdwebProvider } from "@thirdweb-dev/react";

type Props = {
  children: React.ReactNode;
};

const ThirdWebProviderComponent = ({ children }: Props) => {
  return (
    <ThirdwebProvider
      activeChain="ethereum"
      theme="light"
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      {children}
    </ThirdwebProvider>
  );
};

export default ThirdWebProviderComponent;
