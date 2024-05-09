import { ethers, network } from "hardhat";

import { CONTRACT_ADDRESS } from "../../client/src/utils/constant";

async function mockKeepers() {
  const raffle = await ethers.getContractAt(
    "Lottery",
    CONTRACT_ADDRESS.localhost
  );
  const checkData = ethers.keccak256(ethers.toUtf8Bytes(""));
  const { upkeepNeeded } = await raffle.checkUpkeep.staticCall(checkData);
  if (upkeepNeeded) {
    const tx = await raffle.performUpkeep(checkData);
    const txReceipt = await tx.wait(1);
    const requestId = (txReceipt?.logs[1] as any).args[0] as string;

    console.log(`Performed upkeep with RequestId: ${requestId}`);
    if (network.config.chainId == 31337) {
      await mockVrf(requestId, raffle);
    }
  } else {
    console.log("No upkeep needed!");
  }
}

async function mockVrf(requestId: string, raffle: any) {
  console.log("We on a local network? Ok let's pretend...");
  const vrfCoordinatorV2Mock = await ethers.getContractAt(
    "VRFCoordinatorV2Mock",
    CONTRACT_ADDRESS.localhost
  );
  await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address);
  console.log("Responded!");
  const recentWinner = await raffle.getRecentWinner();
  console.log(`The winner is: ${recentWinner}`);
}

mockKeepers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
