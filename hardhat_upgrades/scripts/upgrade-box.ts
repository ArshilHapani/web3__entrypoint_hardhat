import { ethers, upgrades } from "hardhat";

(async function () {
  const proxyAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const BoxV2 = await ethers.getContractFactory("BoxV2");
  const boxV2 = await upgrades.upgradeProxy(proxyAddress, BoxV2);
  console.log("BoxV2 upgraded at:", await boxV2.getAddress());
})();
