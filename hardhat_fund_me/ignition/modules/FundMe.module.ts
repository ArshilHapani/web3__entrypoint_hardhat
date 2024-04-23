import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { network } from "hardhat";

import { netWorkConfig } from "../../helper-hardhat-config";

export default buildModule("FundMe", (m) => {
  const chainId = network.config.chainId ?? 1;
  const parameter = netWorkConfig[chainId].ethUsdPriceFeed;
  const fundMe = m.contract("FundMe", [parameter]);

  m.call(fundMe, "fund");

  return { fundMe };
});
