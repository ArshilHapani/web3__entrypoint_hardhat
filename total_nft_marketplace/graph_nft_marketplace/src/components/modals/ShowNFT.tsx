/* eslint-disable @next/next/no-img-element */
"use client";

import { ethers } from "ethers";

import Modal from "./Modal";

type Props = {
  image: string;
  name: string;
  description: string;
  price: string;
  owner: string;
  tokenId: string;
  nftAddress: string;
  sellerAddress: string;
};

const ShowNFTModal = ({
  description,
  image,
  name,
  nftAddress,
  owner,
  price,
  tokenId,
  sellerAddress,
}: Props) => {
  return (
    <Modal
      type={`show-nft-${nftAddress}${tokenId}`}
      className="w-fit min-w-[300px]"
    >
      <div>
        <img
          src={image}
          alt={name}
          className="h-[200px] w-[200px] object-center mx-auto"
        />
        <hr className="my-4" />
        <h1 className="font-bold text-xl">{name}</h1>
        <h2 className="font-semibold text-gray-700 text-lg">{description}</h2>
        <h3 className="font-semibold tracking-wide text-gray-400 mt-2">
          {price} ETH
        </h3>
        <h3 className="font-semibold mt-1 text-gray-400">owned by {owner}</h3>
        {owner != "you" && (
          <button className="btn btn-outline mt-6">Buy NFT</button>
        )}
      </div>
    </Modal>
  );
};

export default ShowNFTModal;
