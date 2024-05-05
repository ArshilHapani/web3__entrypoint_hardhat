import { ethers, network } from "hardhat";
import { developmentChains, netWorkConfig } from "../helper-hardhat-config";
import { deployLottery, deployMocks } from "./deploy";

const VRF_SUB_FEE = ethers.parseEther("2");

(async function () {
  const mockVrfCoordinator = await deployMocks();
  const transactionResponse = await mockVrfCoordinator.createSubscription();
  const transactionReceipt = await transactionResponse.wait(1);
  const subscriptionIdV = (transactionReceipt?.logs[0] as any)?.args[0];
  console.log("Subscription ID: ", subscriptionIdV);
  await mockVrfCoordinator.fundSubscription(subscriptionIdV, VRF_SUB_FEE);
  const { lotteryContract: lottery } = await deployLottery(
    await mockVrfCoordinator.getAddress(),
    subscriptionIdV
  );
  await mockVrfCoordinator.addConsumer(subscriptionIdV, lottery.getAddress());
  console.log("Consumer added...");

  const additionalEntrance = 7;
  const startingAccounts = 1; // deployer = 0
  const accounts = await ethers.getSigners();
  const lotteryEntranceFee = await lottery.getEntranceFee();
  const interval = await lottery.getInterval();

  for (
    let i = startingAccounts;
    i < additionalEntrance + startingAccounts;
    i++
  ) {
    const accountConnectedToLottery = lottery.connect(accounts[i]);
    await accountConnectedToLottery.enterLottery({ value: lotteryEntranceFee });
    console.log(`Account ${accounts[i].address} entered lottery`);
  }
  console.log("Entered lottery");
  await network.provider.send("evm_increaseTime", [Number(interval) + 1]);
  await network.provider.send("evm_mine", []);

  let [upKeepNeeded] = await lottery.checkUpkeep.staticCall("0x");
  console.log("Upkeep needed: ", upKeepNeeded);
  const participants = await lottery.getNumberOfPlayers();
  console.log("Number of participants: ", participants.toString());
  const tx = await lottery.performUpkeep("0x");
  const receipt = await tx.wait(1);
  const reqId = (receipt?.logs[1] as any).args[0];

  console.log("\nWaiting for event to be emitted...\n");
  lottery.addListener("WinnerPicked", async function () {
    console.log("Event founded!!");
    try {
      const receiptWinner = await lottery.getRecentWinner();
      console.log(`RecentWinner ---- ${receiptWinner}`);
      const lotteryState = await lottery.getLotteryState();
      const numPlayers = await lottery.getNumberOfPlayers();

      console.log("Lottery state: ", lotteryState.toString());
      console.log("Number of players: ", numPlayers.toString());
    } catch (e) {
      console.error(e);
    } finally {
      lottery.removeAllListeners("WinnerPicked" as any);
    }
  });
  await mockVrfCoordinator.fulfillRandomWords(reqId, lottery.getAddress());
})();
