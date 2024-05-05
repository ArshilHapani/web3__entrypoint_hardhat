import { ethers, network } from "hardhat";
import { assert, expect } from "chai";

import { developmentChains, netWorkConfig } from "../../helper-hardhat-config";
import { deployLottery, deployMocks } from "../../scripts/deploy";

import type { Lottery, VRFCoordinatorV2Mock } from "../../typechain-types";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Lottery", function () {
      let lottery: Lottery;
      let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock;
      let chainId = network.config.chainId ?? 1;
      let lotteryEntranceFee: bigint;
      let deployer: string;
      let interval: bigint;

      beforeEach(async function () {
        vrfCoordinatorV2Mock = await deployMocks();
        const transactionResponse =
          await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        const subscriptionId = (transactionReceipt?.logs[0] as any)
          .args[0] as string;
        let { lotteryContract, deployer: deployerAr } = await deployLottery(
          await vrfCoordinatorV2Mock.getAddress(),
          subscriptionId ?? netWorkConfig[chainId].subscriptionId
        );
        lottery = lotteryContract;

        lotteryEntranceFee = await lottery.getEntranceFee();
        deployer = transactionReceipt?.from ?? deployerAr;
        interval = await lottery.getInterval();
        await vrfCoordinatorV2Mock.fundSubscription(
          subscriptionId,
          ethers.parseEther("2")
        );
        await vrfCoordinatorV2Mock.addConsumer(
          subscriptionId,
          lottery.getAddress()
        );
      });

      describe("constructor", function () {
        it("Initializes the lottery correctly", async function () {
          // State must be initialized correctly
          const lotteryState = await lottery.getLotteryState();
          assert.equal(lotteryState.toString(), "0");

          // interval must be initialized correctly
          const interval = await lottery.getInterval();
          assert.equal(
            interval.toString(),
            netWorkConfig[chainId].interval.toString()
          );
        });
      });

      describe("enter lottery", function () {
        it("revert when you don't pay enough", async function () {
          expect(lottery.enterLottery()).to.be.revertedWith(
            "Lottery__MinimumEthRequire"
          );
        });

        it("Records player when they enter", async function () {
          await lottery.enterLottery({ value: lotteryEntranceFee });
          const players = await lottery.getPlayer(0);
          assert.equal(players, deployer);
        });

        it("Emits the correct event when a player enters", async function () {
          expect(lottery.enterLottery({ value: lotteryEntranceFee })).to.emit(
            lottery,
            "Lottery__PlayerEntered"
          );
        });

        it("Dose not allow entrance when calculating ", async function () {
          await lottery.enterLottery({ value: lotteryEntranceFee });

          // increasing time
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          // mining a block
          await network.provider.send("evm_mine", []);

          await lottery.performUpkeep("0x");
          expect(
            lottery.enterLottery({ value: lotteryEntranceFee })
          ).to.be.revertedWith("Lottery__LotteryNotOpen");
        });
      });
      describe("CheckUpKeep", async function () {
        it("Returns false if people haven't send enough ETH", async function () {
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const [upKeepNeeded] = await lottery.checkUpkeep.staticCall("0x");
          assert(!upKeepNeeded);
        });
        it("Returns false if lottery isn't open", async function () {
          await lottery.enterLottery({ value: lotteryEntranceFee });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);

          await lottery.performUpkeep("0x");
          const lotteryState = await lottery.getLotteryState();
          const [upKeepNeeded] = await lottery.checkUpkeep.staticCall(
            new Uint8Array(0)
          );
          assert.equal(lotteryState.toString(), "1");
          assert(!upKeepNeeded);
        });

        it("returns false if enough time has'nt pass", async function () {
          await lottery.enterLottery({ value: lotteryEntranceFee });
          await network.provider.send("evm_increaseTime", [
            Number(interval) - 5,
          ]);
          await network.provider.send("evm_mine", []);
          const tx = await lottery.checkUpkeep("0x");
          const [upKeepNeeded] = await lottery.checkUpkeep.staticCall("0x");
          assert(!upKeepNeeded);
        });

        it("returns true if enough time has passed", async function () {
          await lottery.enterLottery({ value: lotteryEntranceFee });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const [upKeepNeeded] = await lottery.checkUpkeep.staticCall("0x");
          assert(upKeepNeeded);
        });
      });
      describe("performUpKeep", function () {
        it("It can only run if checkUpKeep is true", async function () {
          await lottery.enterLottery({ value: lotteryEntranceFee });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const tx = await lottery.performUpkeep(new Uint8Array(0));
          assert(tx);
        });

        it("revert when checkUpKeep is false", async function () {
          expect(lottery.performUpkeep("0x")).to.be.revertedWith(
            "Lottery__UpKeepNotNeeded"
          );
        });

        it("Updates the raffle state, emit the events and call the vrf coordinator", async function () {
          await lottery.enterLottery({ value: lotteryEntranceFee });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const tx = await lottery.performUpkeep("0x");
          const receipt = await tx.wait(1);
          const reqId = (receipt?.logs[1] as any)?.args.requestId;
          const lotteryState = await lottery.getLotteryState();
          assert(Number(reqId) > 0);
          assert(lotteryState.toString() == "1");
        });
      });

      describe("FullFillRandomWords", function () {
        // need someone to enter the lottery
        beforeEach(async function () {
          await lottery.enterLottery({ value: lotteryEntranceFee });
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
        });

        it("Only be called after performUpkeep", async function () {
          expect(
            vrfCoordinatorV2Mock.fulfillRandomWords(0, deployer)
          ).to.be.revertedWith("nonexistent requestId");
          expect(
            vrfCoordinatorV2Mock.fulfillRandomWords(1, deployer)
          ).to.be.revertedWith("nonexistent requestId");
        });

        it("Picks a winner, resets the lottery, and sends money", async function () {
          const additionalEntrance = 3;
          const startingAccounts = 1; // deployer = 0
          const accounts = await ethers.getSigners();
          for (
            let i = startingAccounts;
            i < additionalEntrance + startingAccounts;
            i++
          ) {
            const accountConnectedToLottery = lottery.connect(accounts[i]);
            await accountConnectedToLottery.enterLottery({
              value: lotteryEntranceFee,
            });
          }
          const startTimeStamp = await lottery.getLatestTimeStamp();

          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);

          let [upKeepNeeded] = await lottery.checkUpkeep.staticCall("0x");
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
              const endingTimeStamp = await lottery.getLatestTimeStamp();

              assert.equal(numPlayers.toString(), "0");
              assert.equal(lotteryState.toString(), "0");
              assert(Number(endingTimeStamp) > Number(startTimeStamp));
            } catch (e) {
              console.error(e);
            } finally {
              lottery.removeAllListeners("WinnerPicked" as any);
            }
          });
          await vrfCoordinatorV2Mock.fulfillRandomWords(
            reqId,
            lottery.getAddress()
          );
        });
      });
    });
