import { viem } from "hardhat";

(async function () {
  const initialSupply: bigint = BigInt(100e18);
  const arshilToken = await viem.deployContract("ArshilToken", [initialSupply]);
  console.log("Contract deployed to address:", arshilToken.address);

  const totalSupply = await arshilToken.read.totalSupply();
  const deployer = (await viem.getWalletClients()).at(0)?.account.address;
  console.log({ deployer });
  console.log("Total supply is:", totalSupply.toString());

  const arshil = await viem.deployContract("Arshil", ["Nami", "Arshil"]);
  await arshil.read.getLover(["Nami"]);
})();
