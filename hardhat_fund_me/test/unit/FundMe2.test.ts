import { expect, assert } from "chai";
import { ethers, network } from "hardhat";

import "dotenv/config";

import type { FundMeV2, FundMeV2__factory } from "../../typechain-types";
import { developmentChains } from "../../helper-hardhat-config";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMeV2", function () {
      let fundMeV2Factory: FundMeV2__factory;
      let fundMeV2: FundMeV2;
      const sendValue = ethers.parseEther("1.5");

      beforeEach(async function () {
        fundMeV2Factory = await ethers.getContractFactory("FundMeV2");
        fundMeV2 = await fundMeV2Factory.deploy();
        await fundMeV2.deploymentTransaction()?.wait(1);
        await fundMeV2.waitForDeployment();
      });

      describe("Constructor", function () {
        it("Owner should be the deployer", async function () {
          const owner = await fundMeV2.i_owner();
          const signer = await (await ethers.provider.getSigner()).getAddress();
          expect(owner).to.equal(signer);
        });
      });

      describe("Fund", function () {
        beforeEach(async function () {
          const tx = await fundMeV2.donate({ value: sendValue });
          await tx.wait(1);
        });
        it("Fails if you don't send enough ETH", async function () {
          const prevBlock = await ethers.provider.getBlockNumber();
          const tx = await fundMeV2.donate({ value: sendValue });
          await tx.wait(1);
          const isTrue =
            (await ethers.provider.getBlockNumber()) === prevBlock + 1;
          assert.isTrue(isTrue);
        });

        it("Should updates donatorsToAmount", async function () {
          const senderAddress =
            (await (await ethers.getSigners()).at(0)?.getAddress()) ?? "";
          const response = await fundMeV2.s_donatorsToAmount(senderAddress);
          assert.equal(response.toString(), sendValue.toString());
        });

        it("Should add donator to the donators array", async function () {
          const senderAddress =
            (await (await ethers.getSigners()).at(0)?.getAddress()) ?? "";
          const donators = await fundMeV2.s_donators(0);
          assert.equal(donators, senderAddress);
        });
      });

      describe("Withdraw", function () {
        let deployer: string;
        beforeEach(async function () {
          const tx = await fundMeV2.donate({ value: sendValue });
          await tx.wait(1);
          deployer = tx.from;
        });

        it("Correctly withdraws funds", async function () {
          // arrange
          const startingContractBalance = await ethers.provider.getBalance(
            fundMeV2.getAddress()
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );
          // act
          const transactionResponse = await fundMeV2.cheapWithDraw();
          // const transactionResponse = await fundMeV2.withDraw();
          const transactionReceipt = await transactionResponse?.wait(1);
          const gasUsed =
            BigInt(transactionReceipt?.gasUsed ?? 0) *
            BigInt(transactionReceipt?.gasPrice ?? 0);
          const endingContractBalance = await ethers.provider.getBalance(
            fundMeV2.getAddress()
          );
          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );
          // assert
          expect(endingContractBalance).to.equal(0);
          expect(
            (startingContractBalance + startingDeployerBalance).toString()
          ).to.equal((endingDeployerBalance + gasUsed).toString());
        });
      });
      afterEach(async function () {
        console.log("Collecting funds...");
        await fundMeV2.cheapWithDraw();
        // await fundMeV2.withDraw();
        console.log("Funds collected.");
      });
    });
