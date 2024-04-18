import type { HardhatRuntimeEnvironment } from "hardhat/types";

import {
  DECIMALS,
  developmentChains,
  INITIAL_ANSWER,
} from "../helper-hardhat-config";

export default async function deployLocalMock({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  if (process.argv.includes("mocks")) {
    if (developmentChains.includes(network.name)) {
      log("Local network detected! Deploying mocks...");
      await deploy("MockV3Aggregator", {
        from: deployer,
        log: true,
        contract: "MockV3Aggregator",
        args: [DECIMALS, INITIAL_ANSWER],
      });
      log("Mocks deployed!");
      log("-----------------------------------");
    }
  }
}
