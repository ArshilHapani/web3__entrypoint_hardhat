import { ethers } from "hardhat";
import { SimpleStorage } from "../typechain-types";

(async function () {
  const contractAddress =
    "0xf61b9956ec5dffb6c6f5cfdd022f6275bf13bd8f8910593947d8ca03444c96dd";

  const receipt = await ethers.provider.getTransactionReceipt(contractAddress);
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  const from = receipt?.blockNumber;
  const to = receipt?.blockNumber;

  const eventABI = SimpleStorageFactory.interface.fragments.find(
    (frag) => frag.type === "event"
  );
  const log =
    (await receipt?.provider.getLogs({
      fromBlock: from,
      toBlock: to,
    })) ?? [];
})();

function hexToDec(hex: string) {
  if (!/^0x([A-Fa-f0-9]{2})+$/.test(hex)) {
    throw new Error("Invalid hexadecimal string");
  }
  hex = hex.startsWith("0x") ? hex.slice(2) : hex;
  return parseInt(hex, 16);
}
