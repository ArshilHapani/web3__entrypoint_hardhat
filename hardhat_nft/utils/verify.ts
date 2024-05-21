import { run } from "hardhat";

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
