import { ethers, ignition } from "hardhat";
import NFTMarketPlace from "../ignition/modules/01-NFTMarketPlace";
import BasicNFT from "../ignition/modules/02-BasicNFT";

(async function () {
  await ignition.deploy(NFTMarketPlace);
  await ignition.deploy(BasicNFT);
})();
