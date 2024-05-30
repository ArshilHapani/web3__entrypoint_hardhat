import { ethers, ignition } from "hardhat";
import Deployer from "../ignition/modules/deploy";
import {
  QUORUM_PERCENTAGE,
  VOTING_DELAY,
  VOTING_PERIOD,
} from "../helper-constants";

(async function () {
  const { governorToken, timeLock } = await ignition.deploy(Deployer);
  const deployer = (await ethers.getSigners()).map(
    (signer) => signer.address
  )[0];
  await delegate(await governorToken.getAddress(), deployer);

  const GovernorContractFactory = await ethers.getContractFactory(
    "GovernorContract"
  );
  const governorContract = await GovernorContractFactory.deploy(
    await governorToken.getAddress(),
    await timeLock.getAddress(),
    QUORUM_PERCENTAGE,
    VOTING_PERIOD,
    VOTING_DELAY,
    {
      gasLimit: 3000000,
    }
  );
  await governorContract.waitForDeployment();
  const governorContractAddress = await governorContract.getAddress();
  console.log(`Governor contract deployed at: ${governorContractAddress}`);
})();

async function delegate(
  governanceTokenAddress: string,
  delegatedAccount: string
) {
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governanceTokenAddress
  );
  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait(1);
  console.log(
    `Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`
  );
}
