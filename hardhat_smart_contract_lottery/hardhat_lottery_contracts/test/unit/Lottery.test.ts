import { ethers, network } from "hardhat";
import { assert } from "chai";

import { developmentChains, netWorkConfig } from "../../helper-hardhat-config";
import { Lottery, VRFCoordinatorV2Mock } from "../../typechain-types";
import { deployLottery, deployMocks } from "../../scripts/deploy";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Lottery", function () {
      let lottery: Lottery;
      let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock;
      let chainId = network.config.chainId ?? 1;

      beforeEach(async function () {
        vrfCoordinatorV2Mock = await deployMocks();
        const transactionResponse =
          await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        const subscriptionId = (transactionReceipt?.logs[0] as any)
          .args[0] as string;
        lottery = await deployLottery(
          await vrfCoordinatorV2Mock.getAddress(),
          subscriptionId ?? netWorkConfig[chainId].subscriptionId
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
    });
