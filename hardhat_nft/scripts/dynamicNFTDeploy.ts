import { ethers, network } from "hardhat";
import fs from "fs";
import path from "path";

import {
  DECIMALS,
  developmentChains,
  INITIAL_ANSWER,
  netWorkConfig,
} from "../helper-hardhat-config";
import getSigner from "../utils/getSigner";
import verifyContract from "../utils/verify";

const chainId = network.config.chainId ?? 31337;

(async function () {
  const signer = await getSigner().then((signer) => signer?.address ?? "");
  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    console.log("Local network detected & deploying mocks 🚠");
    const mockV3Aggregator = await deployMocks();
    ethUsdPriceFeedAddress = await mockV3Aggregator.getAddress();
  } else {
    ethUsdPriceFeedAddress = netWorkConfig[chainId].priceFeedAddress;
  }
  await deployDynamicSVGNFT(ethUsdPriceFeedAddress, signer);
})();

export async function deployMocks() {
  const mockAggregatorFactory = await ethers.getContractFactory(
    "MockV3Aggregator"
  );
  const mockV3Aggregator = await mockAggregatorFactory.deploy(
    DECIMALS,
    INITIAL_ANSWER
  );
  await mockV3Aggregator.deploymentTransaction()?.wait(1);
  console.log(
    "🚠 MockV3Aggregator deployed to:",
    await mockV3Aggregator.getAddress()
  );
  return mockV3Aggregator;
}

export async function deployDynamicSVGNFT(
  priceFeedAddress: string,
  signer?: string
) {
  const dynamicSVGNFTFactory = await ethers.getContractFactory("DynamicSVGNft");
  const lowSVG = fs.readFileSync(
    path.join(__dirname, "../images/svgNFTs/frown.svg"),
    {
      encoding: "utf-8",
    }
  );
  const highSVG = fs.readFileSync(
    path.join(__dirname, "../images/svgNFTs/happy.svg"),
    {
      encoding: "utf-8",
    }
  );
  const dynamicSVGNFT = await dynamicSVGNFTFactory.deploy(
    priceFeedAddress,
    lowSVG,
    highSVG,
    { from: signer }
  );
  await dynamicSVGNFT.deploymentTransaction()?.wait(1);
  const address = await dynamicSVGNFT.getAddress();
  console.log("✅ DynamicSVGNFT deployed to:", address);

  if (!developmentChains.includes(network.name)) {
    console.log("Verify with etherscan...");
    await verifyContract(address, [priceFeedAddress, lowSVG, highSVG]);
    console.log("Contract verified! ✅");
  }
  return dynamicSVGNFT;
}
