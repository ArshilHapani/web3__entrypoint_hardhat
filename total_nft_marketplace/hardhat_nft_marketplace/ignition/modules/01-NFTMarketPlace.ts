import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NFTMarketPlace = buildModule("NFTMarketPlace", (m) => {
  const deployer = m.getAccount(0);
  const tokenOwner = m.getAccount(1);
  const nftMarketPlace = m.contract("NFTMarketPlace", [], { from: deployer });

  return { nftMarketPlace };
});

export default NFTMarketPlace;
