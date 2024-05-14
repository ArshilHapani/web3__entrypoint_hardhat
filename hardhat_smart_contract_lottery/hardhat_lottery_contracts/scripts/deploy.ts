import { network, ethers } from "hardhat";
import fs from "node:fs";

import { developmentChains, netWorkConfig } from "../helper-hardhat-config";
import verifyContract from "../utils/verify";

const VRF_SUB_FEE = ethers.parseEther("2");
const chainId = network.config.chainId ?? 1;

(async function () {
  let vrfCoordinatorV2Address: string,
    subscriptionId: string = "";

  if (developmentChains.includes(network.name)) {
    console.log("Local network detected, deploying mocks...");
    const vrfCoordinatorV2Mock = await deployMocks();
    vrfCoordinatorV2Address = await vrfCoordinatorV2Mock.getAddress();
    // step 1: create a subscription
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait(1);
    subscriptionId = (transactionReceipt?.logs[0] as any).args[0] as string;
    console.log("Subscription ID:", subscriptionId); // 1n
    // step 2: fund the subscription
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FEE);
    // step 3: add consumer
    await vrfCoordinatorV2Mock.addConsumer(
      subscriptionId,
      vrfCoordinatorV2Mock.getAddress()
    );
  } else {
    console.log("Deploying lottery contract...");
    vrfCoordinatorV2Address = netWorkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = netWorkConfig[chainId].subscriptionId;
    await deployLottery(vrfCoordinatorV2Address, subscriptionId);
  }
})();
export async function deployLottery(
  vrfCoordinatorV2Address: string,
  subscriptionId: string
) {
  const entranceFee = netWorkConfig[chainId].entranceFee;
  const keyHash = netWorkConfig[chainId].keyHash;
  const callbackGasLimit = netWorkConfig[chainId].callbackGasLimit;
  const interval = netWorkConfig[chainId].interval;

  const LotteryFactory = await ethers.getContractFactory("Lottery");
  const lotteryContract = await LotteryFactory.deploy(
    vrfCoordinatorV2Address,
    entranceFee,
    keyHash,
    subscriptionId,
    callbackGasLimit,
    interval
  );
  const txRecept = await lotteryContract.deploymentTransaction()?.wait(1);
  const address = await lotteryContract.getAddress();
  const prevFileContent = fs.readFileSync(
    `${__dirname}/../../client/src/utils/constant.ts`,
    "utf-8"
  );
  const newFileContent = prevFileContent.replace(
    new RegExp(`${network.name}: "0x[a-fA-F0-9]{40}"`),
    `${network.name}: "${address}"`
  );
  await fs.promises.writeFile(
    `${__dirname}/../../client/src/utils/constant.ts`,
    newFileContent
  );
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contract on etherscan...");
    await verifyContract(address, [
      vrfCoordinatorV2Address,
      entranceFee,
      keyHash,
      subscriptionId,
      callbackGasLimit,
      interval,
    ]);
  }

  return { lotteryContract, deployer: txRecept?.from ?? "" };
}

export async function deployMocks() {
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
  const prevFileContent = fs.readFileSync(
    `${__dirname}/../../client/src/utils/constant.ts`,
    "utf-8"
  );

  const newFileContent = prevFileContent.replace(
    new RegExp(`${network.name}: "0x[a-fA-F0-9]{40}"`),
    `${network.name}: "${address}"`
  );
  await fs.promises.writeFile(
    `${__dirname}/../../client/src/utils/constant.ts`,
    newFileContent
  );

  return mockVrfCoordinator;
}
