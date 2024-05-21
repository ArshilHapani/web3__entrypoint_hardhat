import { ethers, network } from "hardhat";

import {
  DECIMALS,
  INITIAL_ANSWER,
  netWorkConfig,
} from "../helper-hardhat-config";
import verifyContract from "../utils/verify";

import "dotenv/config";

(async function () {
  if (
    network.name.toLocaleLowerCase().includes("hardhat") ||
    network.name.toLowerCase().includes("localhost") ||
    network.name.toLowerCase().includes("local") ||
    network.name.toLowerCase().includes("ganache") ||
    network.config.chainId === 31337
  ) {
    // await deployLocalMock();
    console.log("Deploying Static FundMe...");
    await deployStaticFundMe();
  } else {
    console.log("Deploying FundMe...");
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

export async function deployStaticFundMe() {
  const FundMeV2Factory = await ethers.getContractFactory("FundMeV2");
  const fundMeV2 = await FundMeV2Factory.deploy();
  console.log("Deployed FundMeV2...");
  await fundMeV2.deploymentTransaction()?.wait(1);
  console.log("Sending transaction....");
  // const tx = await fundMeV2.donate({ value: 10 });
  // await tx.wait(1);
  // console.log(
  //   "Transaction completed - block number",
  //   await (
  //     await tx.getBlock()
  //   )?.number
  // );
  console.log("Contract deployed to:", await fundMeV2.getAddress());

  return fundMeV2;
}
