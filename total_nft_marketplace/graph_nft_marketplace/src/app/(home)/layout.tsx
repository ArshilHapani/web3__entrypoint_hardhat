"use client";

import { useThirdwebConnectedWalletContext } from "@thirdweb-dev/react";

type Props = {
  children: React.ReactNode;
};

const WrapperLayout = ({ children }: Props) => {
  const { address, wallet } = useThirdwebConnectedWalletContext();
  if (!wallet || (wallet?.isConnected() && !address))
    return <h1 className="text-3xl font-bold">Connect your wallet</h1>;
  return <>{children}</>;
};

export default WrapperLayout;
