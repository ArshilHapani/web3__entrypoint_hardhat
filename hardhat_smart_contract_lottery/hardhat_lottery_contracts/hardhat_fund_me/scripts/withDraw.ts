import { ethers } from "hardhat";

(async function () {
  const owner = await ethers.getSigners().then((signer) => signer[0].address);
  const fundMe = await ethers.getContractAt("FundMe", owner);
  console.log("Withdrawing contracts...");
  await fundMe.withdraw();
  console.log("Withdrawn...");
})();
