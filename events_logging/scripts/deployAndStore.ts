import { ethers, run } from "hardhat";

(async function () {
  await run("compile");

  // deploying contract
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deploymentTransaction()?.wait(1);
  await simpleStorage.waitForDeployment();

  const tx = await simpleStorage.store(7);
  const txReceipt = await tx.wait(1);

  //   events
  const events = (txReceipt?.logs[0] as any)?.args;
  console.log(events);

  console.log(
    "Contract deployed to address:",
    await simpleStorage.getAddress()
  );
})();
