import { ethers, network } from "hardhat";
import { developmentChains } from "../helper-hardhat-config";
import verifyContract from "../utils/verify";

(async function () {
  await deployBasicNFT();
})();

export async function deployBasicNFT() {
  const deployer = (await ethers.getSigners()).at(0);
  const basicNFTFactory = await ethers.getContractFactory("BasicNFT", deployer);
  const basicNFT = await basicNFTFactory.deploy();
  await basicNFT.deploymentTransaction()?.wait(1);
  const contractAddress = await basicNFT.getAddress();
  console.log(`BasicNFT deployed to: ${contractAddress}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    console.log(`Verifying contract on Etherscan.....`);
    await verifyContract(contractAddress, null);
  }
  return basicNFT;
}
