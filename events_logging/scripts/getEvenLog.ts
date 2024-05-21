import { ethers } from "hardhat";
import { SimpleStorage } from "../typechain-types";

(async function () {
  // const contractAddress =
  //   "0xba54f5f7857f749ac83f3fdf226c5cdc470a10708abdca6bdfc0ab4958cefa2f"; // sepolia
  const contractAddress =
    "0xcf68abb62f5b3a1e69e120425ed861189cb74b1b8a443ca1bdd21a46755d6842"; // ganache

  const receipt = await ethers.provider.getTransactionReceipt(contractAddress);
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  const from = receipt?.blockNumber;
  const to = receipt?.blockNumber;

  const log = await ethers.provider.getLogs({
    address: "0xd3a9e6DD1609C97A30E5360CEB27a97dE81a5022",
    fromBlock: from,
    toBlock: to,
    topics: [ethers.id("storeNumber")],
  });
  console.log(log);
})();

function hexToDec(hex: string) {
  if (!/^0x([A-Fa-f0-9]{2})+$/.test(hex)) {
    throw new Error("Invalid hexadecimal string");
  }
  hex = hex.startsWith("0x") ? hex.slice(2) : hex;
  return parseInt(hex, 16);
}
