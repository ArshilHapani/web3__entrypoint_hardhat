import { ethers } from "hardhat";

(async function () {
  const owner = await ethers.getSigners().then((signer) => signer[0].address);
  const fundMe = await ethers.getContractAt("FundMe", owner);
  console.log("Funding contracts...");

  const transaction = await fundMe.fund({
    value: ethers.parseEther("1"),
  });
  await transaction.wait(1);

  console.log("Funded...");

  await fundMe.withdraw();
})();
