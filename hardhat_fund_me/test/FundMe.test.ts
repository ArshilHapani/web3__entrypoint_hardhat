import { expect, assert } from "chai";
import { ethers, network } from "hardhat";

import { netWorkConfig } from "../helper-hardhat-config";

import "dotenv/config";

import type { FundMe, FundMe__factory } from "../typechain-types";

describe.skip("FundMe", function () {
  let fundMeFactory: FundMe__factory;
  let fundMe: FundMe;
  const parameter = netWorkConfig[network.config.chainId ?? 1].ethUsdPriceFeed;
  const sendValue = ethers.parseEther("0.05");
  beforeEach(async function () {
    fundMeFactory = await ethers.getContractFactory("FundMe");
    fundMe = await fundMeFactory.deploy(parameter);
    console.log("Deploying FundMe to test net...");
    await fundMe.deploymentTransaction()?.wait(1);
    await fundMe.waitForDeployment();

    console.log("Deployed.");
  });

  describe.skip("Constructor test", function () {
    let expectedAddress: string;
    beforeEach(async function () {
      expectedAddress = await fundMe.i_contract_address();
    });
    it("constructor argument test", async function () {
      const passedAddress = parameter.toString();
      expect(passedAddress.toString()).to.equal(expectedAddress.toString());
    });
  });

  describe.skip("fund", function () {
    it.skip("Fails if you don't send enough ETH", async function () {
      await expect(fundMe.fund({ value: sendValue })).to.be.revertedWith(
        "You need to send more ETH"
      );
    });

    it("updates the FundMe balance", async function () {
      const transaction = await fundMe.fund({ value: sendValue });
      const receipt = await transaction.wait(1);
      const ownerAddress =
        receipt?.from ?? "0x7de7080aB6FFb3F1435378f3E7F15DfAE92c6F3a"; // wallet address (add some ETH)
      const response = await fundMe.fundersToAmount(ownerAddress);
      assert.equal(response.toString(), sendValue.toString());
    });

    it("Adds funder to the funders array", async function () {
      const transaction = await fundMe.fund({ value: sendValue });
      const receipt = await transaction.wait(1);
      const ownerAddress =
        receipt?.from ?? "0x7de7080aB6FFb3F1435378f3E7F15DfAE92c6F3a";
      const funders = await fundMe.funders(0);

      assert.equal(funders, ownerAddress);
    });
  });

  describe("withdraw", function () {
    let deployer: string;
    beforeEach(async function () {
      const tx = await fundMe.fund({ value: sendValue });
      await tx.wait(1);
      deployer = tx.from ?? "0x7de7080aB6FFb3F1435378f3E7F15DfAE92c6F3a";
    });
    it("correctly withdrawing amounts", async function () {
      // arrange
      const startingFundMeBalance = await ethers.provider.getBalance(
        fundMe.getAddress()
      );
      const startingDeployerBalance = await ethers.provider.getBalance(
        deployer
      );
      // act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const gasUsed =
        BigInt(transactionReceipt?.gasUsed ?? 0) *
        BigInt(transactionReceipt?.gasPrice ?? 0);
      const endingFundMeBalance = await ethers.provider.getBalance(
        fundMe.getAddress()
      );
      const endingDeployerBalance = await ethers.provider.getBalance(deployer);
      // assert
      expect(endingFundMeBalance).to.equal(0);
      expect(
        (startingFundMeBalance + startingDeployerBalance).toString()
      ).to.equal((endingDeployerBalance + gasUsed).toString());
    });

    it("Getting funds from multiple funders", async function () {
      // arrange
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = fundMe.connect(accounts[i]);
        // await fundMeConnectedContract.fund({ value: sendValue });
      }
      const startingFundMeBalance = await ethers.provider.getBalance(
        fundMe.getAddress()
      );
      const startingDeployerBalance = await ethers.provider.getBalance(
        deployer
      );

      // act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const gasUsed =
        BigInt(transactionReceipt?.gasUsed ?? 0) *
        BigInt(transactionReceipt?.gasPrice ?? 0);
      const endingFundMeBalance = await ethers.provider.getBalance(
        fundMe.getAddress()
      );
      const endingDeployerBalance = await ethers.provider.getBalance(deployer);

      // assert
      expect(endingFundMeBalance).to.equal(0);
      expect(
        (startingFundMeBalance + startingDeployerBalance).toString()
      ).to.equal((endingDeployerBalance + gasUsed).toString());

      // funders array should be empty
      await expect(fundMe.funders(0)).to.be.reverted;
      for (let i = 1; i < 6; i++) {
        // const response = await fundMe.fundersToAmount(accounts[i].getAddress());
        // expect(response).to.equal(0);
      }
    });
  });

  after(async function () {
    console.log("Withdrawing funds...");
    await fundMe.withdraw();
    console.log("Funds withdrawn.");
  });
});
