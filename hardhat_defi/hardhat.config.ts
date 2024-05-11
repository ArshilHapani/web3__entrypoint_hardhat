import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "dotenv/config";

const config: HardhatUserConfig = {
  // solidity: "0.8.24",
  solidity: {
    compilers: [
      { version: "0.8.24" },
      { version: "0.8.0" },
      { version: "0.6.6" },
      { version: "0.4.19" },
      { version: "0.6.12" },
    ],
  },
  networks: {
    // testnet (sepolia)
    sepolia: {
      url: process.env.ETH_SEPOLIA_URL as string,
      accounts: [process.env.ETH_SEPOLIA_PRIVATE_KEY_METAMASK as string],
      chainId: 11155111,
    },
    hardhat: {
      chainId: 31337,
      forking: {
        url: process.env.MAINNET_RPC_URL as string,
      },
    },
    // local network (ganache)
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0x658f947793d5aca78aba70bc6e575f72bbd8a3c291bbce7265c58d3874941cb9",
      ],
      chainId: 1337,
      forking: {
        url: process.env.MAINNET_RPC_URL as string,
      },
    },
    // local network (hardhat)
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ],
      chainId: 31337,
      forking: {
        url: process.env.MAINNET_RPC_URL as string,
      },
    },
  },
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey:
      (process.env.ETHERSCAN_API_KEY as string) ?? "YOUR_ETHERSCAN_API_KEY", // get it from https://etherscan.io/
  },
  gasReporter: {
    enabled: true,
    outputFile: "gasReport.txt",
    noColors: true,
    currency: "INR",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY ?? "YOUR_API",
    token: "ETH",
  },
};

export default config;
