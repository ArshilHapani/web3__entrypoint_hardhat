import type { HardhatRuntimeEnvironment } from "hardhat/types";
import deployLocalMock from "./00_deloy_mocks";
import { network } from "hardhat";

export default async function deploy(hre: HardhatRuntimeEnvironment) {
  const { deploy, log } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const chainId = hre.network.config.chainId;
  if (network.name.includes("hardhat")) {
    await deployLocalMock(hre);
  } else {
    const fundMe = await deploy("FundMe", {
      from: deployer,
      args: ["0x694AA1769357215DE4FAC081bf1f309aDC325306"], // constructor arguments (price feed address)
      log: true,
    });
    console.log(`Contract deployed to ${fundMe.address}`);
  }
}
