import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";

import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
};

export default config;
