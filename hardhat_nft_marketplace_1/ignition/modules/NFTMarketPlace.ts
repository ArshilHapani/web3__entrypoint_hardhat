import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NFTMarketPlace = buildModule("NFTMarketPlace", (m) => {
  const nftMarketPlace = m.contract("NFTMarketPlace");
  return { nftMarketPlace };
});

export default NFTMarketPlace;
