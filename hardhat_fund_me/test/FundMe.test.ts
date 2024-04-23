import { expect, assert } from "chai";
import { ethers, network } from "hardhat";

import { netWorkConfig } from "../helper-hardhat-config";

import "dotenv/config";

import type { FundMe, FundMe__factory } from "../typechain-types";

describe("FundMe", function () {
  let fundMeFactory: FundMe__factory;
  let fundMe: FundMe;
  const parameter = netWorkConfig[network.config.chainId ?? 1].ethUsdPriceFeed;
  let expectedAddress: string;
  const sendValue = ethers.parseEther("1");
  beforeEach(async function () {
    fundMeFactory = await ethers.getContractFactory("FundMe");
    fundMe = await fundMeFactory.deploy(parameter);
    console.log("Deploying FundMe to test net...");
    await fundMe.deploymentTransaction()?.wait(3);
    await fundMe.waitForDeployment();
    console.log("Deployed.");
  });

  describe.skip("Constructor test", function () {
    beforeEach(async function () {
      expectedAddress = await fundMe.i_contract_address();
    });
    it("constructor argument test", async function () {
      const passedAddress = parameter.toString();
      expect(passedAddress.toString()).to.equal(expectedAddress.toString());
    });
  });

  describe("fund", function () {
    it.skip("Fails if you don't send enough ETH", async function () {
      await expect(fundMe.fund({ value: sendValue })).to.be.revertedWith(
        "You need to send more ETH"
      );
    });

    it("updates the FundMe balance", async function () {
      fundMe.fund({ value: sendValue });
      const [owner] = await ethers.getSigners();
      const response = await fundMe.funderToAmount(owner.address);
      assert.equal(response.toString(), sendValue.toString());
    });
  });
});
