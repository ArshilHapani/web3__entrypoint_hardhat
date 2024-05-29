"use client";

import Modal from "./Modal";

type Props = {
  nftAddress: string;
  tokenId: number;
  price: number;
};

const UpdatePriceModal = ({ nftAddress, price, tokenId }: Props) => {
  return (
    <Modal type={`update-price-${nftAddress}${price}`}>
      <h2>{nftAddress}</h2>
    </Modal>
  );
};

export default UpdatePriceModal;
