import { task } from "hardhat/config";

task("blockNumber", "Prints the current block number").setAction(
  async function (taskArgs, hre) {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`Current block number: ${blockNumber}`);
  }
);
