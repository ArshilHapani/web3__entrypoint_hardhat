import { ethers } from "hardhat";

import getSigner from "./getSigner";

export default async function deployMocks() {
  const MockContractFactory = await ethers.getContractFactory(
    "VRFCoordinatorV2Mock"
  );
  const BASE_FEE = ethers.parseEther("0.25");
  const GAS_PRICE_LINK = 1e8; // Calculated value based on the gas price of the chain
  const mockVrfCoordinator = await MockContractFactory.deploy(
    BASE_FEE,
    GAS_PRICE_LINK
  );
  await mockVrfCoordinator.deploymentTransaction()?.wait(1);
  const address = await mockVrfCoordinator.getAddress();
  console.log("Mock VRF Coordinator deployed to:", address);

  const tx = await mockVrfCoordinator.createSubscription();
  const txReceipt = await tx.wait(1);
  const subscriptionId = (txReceipt?.logs[0] as any).args[0] as string;
  await mockVrfCoordinator.fundSubscription(
    subscriptionId,
    ethers.parseEther("0.01")
  );
  const cs = await mockVrfCoordinator.addConsumer(
    subscriptionId,
    await getSigner().then((signer) => signer?.address ?? "")
  );
  await cs.wait(1);
  const flg = await mockVrfCoordinator.consumerIsAdded(
    subscriptionId,
    await getSigner().then((signer) => signer?.address ?? "")
  );
  console.log("Consumer added to subscription:", flg);
  return { address, subscriptionId, mockVrfCoordinator };
}
