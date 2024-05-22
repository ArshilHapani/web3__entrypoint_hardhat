import { ethers } from "hardhat";

const netWorkConfig: {
  [key: number]: {
    name: string;
    vrfCoordinatorV2: string;
    entranceFee: bigint;
    keyHash: string;
    subscriptionId: string;
    callbackGasLimit: string;
    interval: number;
    mintFee: bigint;
    priceFeedAddress: string;
  };
} = {
  11155111: {
    name: "sepolia",
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    entranceFee: ethers.parseEther("0.000001"),
    keyHash:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    subscriptionId: "2659",
    // 15366376269897563744780985323350096414521302377970374217356556294839422166091
    callbackGasLimit: "500000",
    interval: 50,
    mintFee: ethers.parseEther("0.001"),
    priceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
  1337: {
    name: "ganache",
    vrfCoordinatorV2: "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255",
    entranceFee: ethers.parseUnits("0.05"),
    keyHash:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    subscriptionId: "0",
    callbackGasLimit: "500000",
    interval: 50,
    mintFee: ethers.parseEther("0.001"),
    priceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
  31337: {
    name: "hardhat",
    vrfCoordinatorV2: "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255",
    entranceFee: ethers.parseUnits("0.05"),
    keyHash:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    subscriptionId: "0",
    callbackGasLimit: "500000",
    interval: 50,
    mintFee: ethers.parseEther("0.001"),
    priceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
};

const developmentChains = ["hardhat", "localhost", "ganache"];
const DECIMALS = 8;
const INITIAL_ANSWER = 350000000000;

export { netWorkConfig, developmentChains, DECIMALS, INITIAL_ANSWER };
