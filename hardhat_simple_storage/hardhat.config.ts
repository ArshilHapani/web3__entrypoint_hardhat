import type { HardhatUserConfig } from "hardhat/config";
import { config as dotEnvConfig } from "dotenv";

import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "hardhat-gas-reporter";
import "solidity-coverage";

import "./tasks/blockNumber.task";

dotEnvConfig();

const SEPOLIA_RPC_URL =
  process.env.ETH_SEPOLIA_URL ?? "https://arshil.vercel.app";
const SEPOLIA_PRIVATE_KEY =
  process.env.ETH_SEPOLIA_PRIVATE_KEY_METAMASK ?? "0x1020";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  // default network hardhat
  defaultNetwork: "hardhat",
  networks: {
    // testnet (sepolia)
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
    },
    // local network (ganache)
    ethereum: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0xafeebd6b2c3af9521bb3490c4353101f13ae780feab70e453c8164dbc44ea22e",
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
    apiKey: process.env.ETHERSCAN_API_KEY ?? "YOUR_ETHER",
  },
  sourcify: {
    enabled: true,
  },
  gasReporter: {
    enabled: false,
    outputFile: "gasReport.txt",
    noColors: true,
    currency: "INR",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY ?? "YOUR_API",
    token: "BNB",
  },
};

export default config;
