// import { ethers } from "hardhat";

// (async function () {
//   const signerAddresses = await Promise.all(
//     (await ethers.getSigners()).map(async (signer) => await signer.getAddress())
//   );

//   const Box = await ethers.getContractFactory("Box");
//   const BoxV2 = await ethers.getContractFactory("BoxV2");
//   const BoxProxyAdmin = await ethers.getContractFactory("BoxProxyAdmin");

//   const box = await Box.deploy();
//   const boxV2 = await BoxV2.deploy();
//   const boxProxyAdmin = await BoxProxyAdmin.deploy(signerAddresses[0]);

//   await box.waitForDeployment();
//   await boxV2.waitForDeployment();
//   await boxProxyAdmin.waitForDeployment();

//   const upgradeTx = await boxProxyAdmin.upgradeAndCall(
//     await box.getAddress(),
//     await boxV2.getAddress(),
//     boxV2.interface.encodeFunctionData("increment")
//   );
//   await upgradeTx.wait(1);
//   const version = await box.version();
//   console.log("Box upgraded to version:", version);
// })();

import { ethers, upgrades } from "hardhat";

(async function () {
  const Box = await ethers.getContractFactory("Box");
  const box = await upgrades.deployProxy(Box, [42], { initializer: "store" });
  await box.waitForDeployment();
  const boxAddress = await box.getAddress();
  console.log("Box deployed to:", boxAddress);
  console.log(`Version of box ${await box.version()}`);
  console.log(`Value of num ${await box.retrieve()}`);

  const BoxV2 = await ethers.getContractFactory("BoxV2");
  const boxV2 = await upgrades.upgradeProxy(boxAddress, BoxV2);
  console.log("\n\nBoxV2 upgraded at:", await boxV2.getAddress());
  console.log(`Version of box ${await boxV2.version()}`);
  await boxV2.increment();
  console.log(`Value of num ${await boxV2.retrieve()}`);
})();
