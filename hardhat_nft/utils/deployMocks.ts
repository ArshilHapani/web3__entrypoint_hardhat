import { ethers } from "hardhat";

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
  return mockVrfCoordinator;
}
