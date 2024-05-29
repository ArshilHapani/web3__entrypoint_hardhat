"use client";

import { useQuery } from "@apollo/client";
import { useThirdwebConnectedWalletContext } from "@thirdweb-dev/react";

import { SkeletonLoader } from "@/app/page";
import Heading from "@/components/Heading";
import NFTBox from "@/components/NFTBox";
import { getMyNFTs } from "@/constants/subGraphQueries";
import { MyNFTApolloReturnData } from "@/utils/types";

export default function MyNFT() {
  const { address } = useThirdwebConnectedWalletContext();
  const { data, loading, error, refetch } = useQuery(getMyNFTs(address ?? ""));
  let nftData = data as MyNFTApolloReturnData;
  if (error) return <p>Error: {error.message}</p>;
  if (loading) return <SkeletonLoader count={5} />;
  if (nftData.activeItems.length === 0)
    return <h1 className="text-3xl font-bold">No NFT&apos;s found</h1>;
  return (
    <div>
      <Heading title="My NFT's" />
      <div className="flex gap-6 flex-wrap">
        {nftData.activeItems.map((item: any) => (
          <NFTBox key={item.id} item={item} refetch={refetch} />
        ))}
      </div>
    </div>
  );
}
