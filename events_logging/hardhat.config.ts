import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.8",
  networks: {
    sepolia: {
      url: process.env?.ETH_SEPOLIA_URL,
      accounts: [process.env?.ETH_SEPOLIA_PRIVATE_KEY_METAMASK!],
      chainId: 11155111,
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0xa31912876f593a8acb572d13391c8b8a0199dc1c58f8eb49fa51c63455541113",
      ],
      chainId: 1337,
    },
    // local network (hardhat)
    localHardHat: {
      url: "http://127.0.0.1:8545/",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ],
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: process.env?.ETHERSCAN_API_KEY,
  },
};

export default config;
