import { ethers, network } from "hardhat";

import {
  DECIMALS,
  INITIAL_ANSWER,
  netWorkConfig,
} from "../helper-hardhat-config";
import verifyContract from "../utils/verify";

import "dotenv/config";

(async function () {
  console.log("Deploying FundMe...");
  if (
    network.name.toLocaleLowerCase().includes("hardhat") ||
    network.name.toLowerCase().includes("local") ||
    network.name.toLowerCase().includes("ganache")
  ) {
    await deployLocalMock();
  } else {
    await deployFundMe();
  }
})();

export async function deployFundMe() {
  const FundMeFactory = await ethers.getContractFactory("FundMe");
  const chainId = network.config.chainId;
  const parameter = netWorkConfig[chainId ?? 1].ethUsdPriceFeed;
  const mockV3Aggregator = await (
    await ethers.getContractFactory("MockV3Aggregator")
  ).deploy(DECIMALS, INITIAL_ANSWER);

  console.log("Deploying FundMe to test net...");
  const fundMe = await FundMeFactory.deploy(parameter);
  await fundMe.deploymentTransaction()?.wait(1);
  const contractAddress = await fundMe.getAddress();
  const mockV3AggregatorAddress = await mockV3Aggregator.getAddress();
  console.log({
    contractAddress: await fundMe.i_contract_address(),
    mockV3AggregatorAddress,
  });

  console.log("-----------------------------------");
  await verifyContract(contractAddress, [parameter]);
  return FundMeFactory;
}

async function deployLocalMock() {
  console.log("Local network detected! Deploying mocks...");
  const MockV3Factory = await ethers.getContractFactory("MockV3Aggregator");
  console.log("Deploying Mocks...");
  const mockV3Aggregator = await MockV3Factory.deploy(DECIMALS, INITIAL_ANSWER);
  await mockV3Aggregator.deploymentTransaction()?.wait(1);

  const data = await mockV3Aggregator.getFunction("description")();
  console.log("description:", data);

  console.log("Mock deployed to:", await mockV3Aggregator.getAddress());
  console.log("-----------------------------------");
}

async function deployAggregatorV3() {
  const MockV3AggregatorFactory = await ethers.getContractFactory(
    "MockV3Aggregator"
  );
  const mockV3Aggregator = await MockV3AggregatorFactory.deploy(
    DECIMALS,
    INITIAL_ANSWER
  );
  await mockV3Aggregator.deploymentTransaction()?.wait(1);
  return mockV3Aggregator;
}
