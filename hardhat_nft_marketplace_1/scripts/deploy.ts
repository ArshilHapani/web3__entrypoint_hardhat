import { ethers } from "hardhat";

(async function () {
  const nftMarketPlaceFactory = await ethers.getContractFactory(
    "NFTMarketPlace"
  );
  const nftMarketPlace = await nftMarketPlaceFactory.deploy();
  await nftMarketPlace.deploymentTransaction()?.wait(1);
  const address = await nftMarketPlace.getAddress();
  console.log(`NFT Marketplace is deployed at ${address}`);
})();
