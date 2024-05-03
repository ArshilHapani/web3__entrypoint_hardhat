import { ethers, network } from "hardhat";
import { developmentChains, netWorkConfig } from "../helper-hardhat-config";
import { deployLottery, deployMocks } from "./deploy";

const VRF_SUB_FEE = ethers.parseEther("2");
const chainId = network.config.chainId ?? 1;

(async function () {
  let vrfCoordinatorV2Address: string,
    subscriptionId: string = "";
  if (developmentChains.includes(network.name)) {
    console.log("Local network detected, deploying mocks...");
    const vrfCoordinatorV2Mock = await deployMocks();
    vrfCoordinatorV2Address = await vrfCoordinatorV2Mock.getAddress();
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait(1);
    subscriptionId = (transactionReceipt?.logs[0] as any).args[0] as string;
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FEE);
  } else {
    console.log("Deploying lottery contract...");
    vrfCoordinatorV2Address = netWorkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = netWorkConfig[chainId].subscriptionId;
    await deployLottery(vrfCoordinatorV2Address, subscriptionId);
  }
  const lottery = await deployLottery(vrfCoordinatorV2Address, subscriptionId);

  await lottery.checkUpkeep("0x");
  const tx = await lottery.performUpkeep("0x");
  const txRecept = await tx.wait(1);
  const events = (txRecept?.logs[1] as any).args;
  console.log({ events });
})();
