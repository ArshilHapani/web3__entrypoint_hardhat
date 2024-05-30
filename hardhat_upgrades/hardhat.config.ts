import { type HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import "@openzeppelin/hardhat-upgrades";

import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.8.24" },
      { version: "0.8.25" },
      { version: "0.8.19" },
      { version: "0.8.0" },
      { version: "0.8.20" },
      { version: "0.8.7" },
    ],
  },

  networks: {
    // testnet (sepolia)
    sepolia: {
      url: process.env.ETH_SEPOLIA_URL as string,
      accounts: [process.env.ETH_SEPOLIA_PRIVATE_KEY_METAMASK as string],
      chainId: 11155111,
    },
    // local network (hardhat)
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
      ],
      chainId: 31337,
    },
  },
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey:
      (process.env.ETHERSCAN_API_KEY as string) ?? "YOUR_ETHERSCAN_API_KEY", // get it from https://etherscan.io/
  },
  gasReporter: {
    enabled: false,
    outputFile: "gasReport.txt",
    noColors: true,
    currency: "INR",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY ?? "YOUR_API",
    token: "ETH",
  },
};

export default config;
