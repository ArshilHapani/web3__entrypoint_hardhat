import { ethers, run, network } from "hardhat";
import * as dotEnv from "dotenv";
dotEnv.config();

(async function () {
  const AnimeCharacterFactory = await ethers.getContractFactory("Arshil");
  console.log("Deploying AnimeCharacterFactory...");
  const animeCharacters = await AnimeCharacterFactory.deploy();
  const contractAddress = await animeCharacters.getAddress();
  console.log(
    "AnimeCharacterFactory deployed to:",
    contractAddress,
    "in network",
    network.name
  );
  // verify contract only in sepolia network
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("waiting for blocks confirmations");
    await animeCharacters.deploymentTransaction()?.wait(5); // waiting for 5 blocks confirmation
    await verify(contractAddress, []);
  }
  await animeCharacters.setUser(10, "Robin");
  const currentUser = await animeCharacters.getUser();
  console.log({ currentUser });

  await animeCharacters.addCharacter(10, "Nami");
  await animeCharacters.addCharacter(20, "Robin");
  await animeCharacters.addCharacter(30, "Mikasa");

  (await animeCharacters.getCharacterArray()).forEach((item) => {
    console.log(`key ${item[0]}, value ${item[1]}`);
  });
  console.log(await animeCharacters.getCharacterMappings(10));
})();

async function verify(contractAddress: string, args: any) {
  console.log("Verifying contract");
  // run allows us to run any hardhat command line function
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
