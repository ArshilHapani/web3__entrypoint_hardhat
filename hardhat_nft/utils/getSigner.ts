import { ethers } from "hardhat";

export default async function getSigner() {
  const signer = (await ethers.getSigners()).at(0);
  return signer;
}
