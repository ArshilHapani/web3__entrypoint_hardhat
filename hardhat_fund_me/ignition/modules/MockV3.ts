import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { network } from "hardhat";

import { DECIMALS, INITIAL_ANSWER } from "../../helper-hardhat-config";

export default buildModule("MockV3Aggregator", (m) => {
  const fundMe = m.contract("MockV3Aggregator", [DECIMALS, INITIAL_ANSWER]);

  return { fundMe };
});
