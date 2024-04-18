import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

const config: HardhatUserConfig = {
  // solidity: "0.8.24",
  solidity: {
    compilers: [{ version: "0.8.24" }, { version: "0.6.6" }],
  },
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;
