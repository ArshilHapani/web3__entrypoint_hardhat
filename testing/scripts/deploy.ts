import { ethers, ignition, network } from "hardhat";
import NFTMarketPlace from "../ignition/modules/01-NFTMarketPlace";
import BasicNFT from "../ignition/modules/02-BasicNFT";
import { developmentChains } from "../helper-hardhat-config";
import verifyContract from "../utils/verify";

(async function () {
  const nftContractAddress = await ignition
    .deploy(NFTMarketPlace)
    .then((res) => res.nftMarketPlace.getAddress());
  const basicNftAddress = await ignition
    .deploy(BasicNFT)
    .then((res) => res.basicNFT.getAddress());

  if (!developmentChains.includes(network.name)) {
    await verifyContract(nftContractAddress, []);
    await verifyContract(basicNftAddress, []);
  }
})();
