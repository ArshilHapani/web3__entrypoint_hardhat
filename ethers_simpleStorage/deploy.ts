import { ethers } from "ethers";
import fs from "fs-extra";

async function deployContract(
  abi: string,
  binaries: string,
  wallet: ethers.Wallet
) {
  const contractFactory = new ethers.ContractFactory(abi, binaries, wallet);
  console.log("Deploying contract...");

  return await contractFactory.deploy();
}

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);

  const wallet = new ethers.Wallet(process.env.WALLET_SECRET_KEY!, provider);
  const abi = fs.readFileSync("./AnimeCharacters_sol_Arshil.abi", "utf8");
  const binaries = fs.readFileSync("./AnimeCharacters_sol_Arshil.bin", "utf8");

  const contract = await deployContract(abi, binaries, wallet);

  await contract.deploymentTransaction()?.wait(1);
  console.log(`Contract deployed at address: ${await contract.getAddress()}`);

  const transaction = await (contract as any)?.setUser(10, "Robin");
  transaction.wait(1); // transaction receipt
  console.log(await transaction);
  const currentUser = await (contract as any)?.getUser();
  console.log({ currentUser });
}

try {
  main().then(() => process.exit(0));
} catch (error: any) {
  console.error(error);
  process.exit(1);
}
