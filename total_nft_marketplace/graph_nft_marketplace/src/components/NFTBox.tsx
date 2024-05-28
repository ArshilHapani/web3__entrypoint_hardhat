/* eslint-disable @next/next/no-img-element */
"use client";

import { useThirdwebConnectedWalletContext } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

import getTokenURI from "@/utils/getTokenURI";
import { ethers } from "ethers";
import { ReturnedData } from "@/utils/types";
import { Archive } from "lucide-react";
import ShowNFTModal from "./modals/ShowNFT";
import useModal from "@/hooks/useModal";

type Props = {
  item: ReturnedData["activeItems"][0];
};
type NFTResponse = {
  name: string;
  attributes: [{ trait_type: string; value: string | number | any }];
  description: string;
  image: string;
};

const NFTBox = ({
  item: { nftAddress, tokenId, __typename, buyer, id, price, seller },
}: Props) => {
  const { wallet, signer, address } = useThirdwebConnectedWalletContext();
  const [nftData, setNftData] = useState({
    name: "",
    description: "",
    image: "",
  });
  useEffect(() => {
    (async function () {
      const tokenUri = await getTokenURI(nftAddress, tokenId, signer);

      if (tokenUri) {
        const requestURL = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
        const response = (await (
          await fetch(requestURL)
        ).json()) as NFTResponse;
        const imageURI = response.image.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        setNftData({
          name: response.name,
          description: response.description,
          image: imageURI,
        });
      }
    })();
  }, [nftAddress, signer, tokenId, wallet]);
  const isOwnedByYou =
    seller.toLowerCase() == address?.toLocaleLowerCase() || seller == undefined;
  const { openModal } = useModal();
  const formattedSellerAddress = isOwnedByYou
    ? "you"
    : seller?.slice(0, 6) + "..." + seller?.slice(-4);
  return (
    <>
      <div className="border group relative rounded-md px-3 py-4 bg-gray-100 hover:shadow-md cursor-pointer transition-all duration-300">
        {/* overlay */}
        <div className="hidden group-hover:block group-hover:opacity-100 transition-all duration-300 absolute inset-0 bg-black/50 backdrop-blur-sm rounded-md">
          <div className="w-full h-full flex items-center justify-center">
            <button
              onClick={() => openModal(`show-nft-${nftAddress}${tokenId}`)}
              className="btn btn-outline text-white"
            >
              View NFT
            </button>
          </div>
        </div>
        {/* archive button */}
        {isOwnedByYou && (
          <div
            data-tip={`Archive ${nftData.name}`}
            className="tooltip absolute top-2 right-2"
          >
            <button className="btn btn-circle btn-sm">
              <Archive className="h-4 w-4" color="red" />
            </button>
          </div>
        )}
        <img
          src={nftData.image}
          alt={nftData.name}
          className="w-full h-[200px] object-cover"
          loading="lazy"
        />
        <hr className="my-4" />
        <h1 className="font-bold text-xl">{nftData.name}</h1>
        <h3 className="font-semibold tracking-wide text-gray-400 mt-2">
          {ethers.utils.formatUnits(price).toString()} ETH
        </h3>
        <h3 className="font-semibold mt-1 text-gray-400">
          owned by {formattedSellerAddress}
        </h3>
      </div>
      <ShowNFTModal
        description={nftData.description}
        image={nftData.image}
        name={nftData.name}
        price={ethers.utils.formatUnits(price).toString()}
        nftAddress={nftAddress}
        tokenId={tokenId}
        owner={formattedSellerAddress}
        sellerAddress={seller}
      />
    </>
  );
};

export default NFTBox;
