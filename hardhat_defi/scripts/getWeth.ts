import { ethers } from "hardhat";

export const AMOUNT = ethers.parseEther("0.01");

export default async function getWeth() {
  const deployer = (await ethers.getSigners()).at(0);
  // address 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
  // abi ✅

  const iWeth = await ethers.getContractAt(
    "IWeth",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    deployer
  );
  const tx = await iWeth.deposit({ value: AMOUNT });
  await tx.wait(1);
  const wethBalance = await iWeth.balanceOf(deployer?.getAddress() ?? "");
  console.log(`Got ${ethers.formatEther(wethBalance)} WETH!`);
}
