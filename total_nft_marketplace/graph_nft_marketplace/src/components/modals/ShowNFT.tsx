/* eslint-disable @next/next/no-img-element */
"use client";

import { Copy } from "lucide-react";
import Modal from "./Modal";
import toast from "react-hot-toast";

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
  function handleCopyAddress(content: string) {
    navigator.clipboard.writeText(content);
    toast.success(`${content} copied to clipboard`);
  }
  return (
    <Modal
      type={`show-nft-${nftAddress}${tokenId}`}
      className="w-fit min-w-[350px]"
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
        {/* owner address section */}
        <div className="flex items-center gap-3">
          <h3 className="font-semibold mt-1 text-gray-400">owned by {owner}</h3>
          <div className="tooltip" data-tip="Copy Address">
            <button
              className="rounded-full bg-gray-200 hover:bg-gray-300 p-2"
              onClick={() => handleCopyAddress(sellerAddress)}
            >
              <Copy size={15} />
            </button>
          </div>
        </div>
        {/* nft address section */}
        <div className="flex items-center gap-3">
          <h3 className="font-semibold mt-1 text-gray-400">
            NFT Address {nftAddress.slice(0, 6) + "..." + nftAddress.slice(-4)}
          </h3>
          <div className="tooltip" data-tip="Copy Address">
            <button
              className="rounded-full bg-gray-200 hover:bg-gray-300 p-2"
              onClick={() => handleCopyAddress(nftAddress)}
            >
              <Copy size={15} />
            </button>
          </div>
        </div>
        {/* token ID */}
        <div className="flex items-center gap-3">
          <h3 className="font-semibold mt-1 text-gray-400">
            Token ID {tokenId}
          </h3>
          <div className="tooltip" data-tip="Copy Address">
            <button
              className="rounded-full bg-gray-200 hover:bg-gray-300 p-2"
              onClick={() => handleCopyAddress(tokenId)}
            >
              <Copy size={15} />
            </button>
          </div>
        </div>
        {owner != "you" && (
          <button className="btn btn-outline mt-6">Buy NFT</button>
        )}
      </div>
    </Modal>
  );
};

export default ShowNFTModal;
