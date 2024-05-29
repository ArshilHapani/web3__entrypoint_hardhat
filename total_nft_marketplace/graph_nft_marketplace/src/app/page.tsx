"use client";

import { useThirdwebConnectedWalletContext } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { useQuery as useAppolloQuery } from "@apollo/client";

import NFTBox from "@/components/NFTBox";
import { getActiveItems } from "@/constants/subGraphQueries";
import Heading from "@/components/Heading";

import { ReturnedData } from "@/utils/types";

export default function Home() {
  const { address, wallet } = useThirdwebConnectedWalletContext();
  const { loading, error, data } = useAppolloQuery(getActiveItems);
  let ndata = data as ReturnedData;
  const [balance, setBalance] = useState("");
  useEffect(() => {
    (async function () {
      const balance = await wallet?.balance();
      setBalance(balance?.displayValue ?? "");
    })();
  }, [balance, wallet]);
  if (loading) return <SkeletonLoader count={10} />;
  if (error) return <p>Error: {error.message}</p>;
  if (!wallet || (wallet?.isConnected() && !address))
    return <h1 className="text-3xl font-bold">Connect your wallet</h1>;
  return (
    <div>
      <Heading title="Recent Listings" />
      <div className="flex gap-6 flex-wrap">
        {ndata.activeItems.map((item: any) => (
          <NFTBox key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonLoader({ count }: { count: number }) {
  return (
    <>
      <div className="skeleton w-40 h-10 mb-10"></div>
      <div className="flex gap-6 flex-wrap">
        {Array.from({ length: count }).map((_, index) => (
          <div
            className="flex flex-col gap-4 w-52"
            key={index + "SKeleton_NFT_Card"}
          >
            <div className="flex flex-col gap-4 w-52">
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
