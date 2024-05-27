import { ignition, run } from "hardhat";
import NFTMarketPlace from "../ignition/modules/01-NFTMarketPlace";
import BasicNFT from "../ignition/modules/02-BasicNFT";

export default async function verifyContract(
  contractAddress: string,
  args: any
) {
  console.log("Verifying contract on etherscan...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified"))
      console.log("Contract already verified");
    else console.error(error);
  }
}

export async function deployFixture() {
  const { nftMarketPlace } = await ignition.deploy(NFTMarketPlace);
  const { basicNFT } = await ignition.deploy(BasicNFT);
  return { nftMarketPlace, basicNFT };
}
