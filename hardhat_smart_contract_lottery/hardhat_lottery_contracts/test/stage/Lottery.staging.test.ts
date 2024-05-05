import { ethers, network } from "hardhat";
import { assert, expect } from "chai";

import { developmentChains, netWorkConfig } from "../../helper-hardhat-config";
import { deployLottery } from "../../scripts/deploy";

import type { Lottery } from "../../typechain-types";

const chainID = network.config.chainId ?? 1;
const vrfCoordinatorV2Address = netWorkConfig[chainID].vrfCoordinatorV2;
const subscriptionId = netWorkConfig[chainID].subscriptionId;

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Lottery", function () {
      let lottery: Lottery;
      let lotteryEntranceFee: bigint;
      let deployer: string;

      beforeEach(async function () {
        let { deployer: deployerReturned, lotteryContract } =
          await deployLottery(vrfCoordinatorV2Address, subscriptionId);
        deployer = deployerReturned;
        lottery = lotteryContract;
        lotteryEntranceFee = await lottery.getEntranceFee();
      });

      describe("fullFillRandomWord", function () {
        it("Works with live chainlink keepers, VRF, we get a random winner ", async function () {
          const startingTimeStamp = await lottery.getLatestTimeStamp();
          const accounts = await ethers.getSigners();

          await new Promise(async function (resolve, reject) {
            lottery.addListener("WinnerPicked", async function () {
              console.log("WinnerPicked event emitted");
              try {
                const recentWinner = await lottery.getRecentWinner();
                const lotteryState = await lottery.getLotteryState();
                const winnerBalance = await ethers.provider.getBalance(
                  accounts[0].address
                );
                const endingTimeStamp = await lottery.getLatestTimeStamp();

                expect(lottery.getPlayer(0)).to.be.reverted;
                assert.equal(recentWinner.toString(), accounts[0].address);
                assert.equal(lotteryState.toString(), "0");
                assert.equal(
                  winnerBalance.toString(),
                  (winnerStartingBalance + lotteryEntranceFee).toString()
                );
                assert(endingTimeStamp > startingTimeStamp);
                resolve(true);
              } catch (error: any) {
                console.log(error);
                reject(error);
              } finally {
                lottery.removeAllListeners("WinnerPicked" as any);
              }
            });

            await lottery.enterLottery({ value: lotteryEntranceFee });
            const winnerStartingBalance = await ethers.provider.getBalance(
              accounts[0].address
            );
          });
        });
      });
    });
