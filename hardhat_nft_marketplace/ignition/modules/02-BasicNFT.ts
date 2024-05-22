import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const BasicNFT = buildModule("BasicNFT", (m) => {
  const deployer = m.getAccount(0);
  const basicNFT = m.contract("BasicNft", [], { from: deployer });
  return { basicNFT };
});
export default BasicNFT;
