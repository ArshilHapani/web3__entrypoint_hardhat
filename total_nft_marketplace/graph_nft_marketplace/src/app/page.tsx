"use client"

import { useWallet, useThirdwebConnectedWalletContext } from "@thirdweb-dev/react"
import { useEffect, useState } from "react";

export default function Home() {
  const { address, chainId, wallet } = useThirdwebConnectedWalletContext();
  const [balance, setBalance] = useState("");
  useEffect(() => {
    (async function () {
      const balance = await wallet?.balance();
      setBalance(balance?.displayValue ?? "");
    })();
  }, [balance, wallet]);
  return (
    <div>
      <div className="border-b" >
        <h1 className="text-4xl font-bold">MarketPlace</h1>
      </div>
      <p>Wallet Address: {address}</p>
      <p>Chain ID: {chainId}</p>
      <p>Balance: {balance}</p>
    </div>
  );
}
