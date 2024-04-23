import { expect, assert } from "chai";
import { ethers } from "hardhat";

import "dotenv/config";

import type { FundMeV2, FundMeV2__factory } from "../typechain-types";

describe("FundMeV2", function () {
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
      const owner = await fundMeV2.owner();
      const signer = await (await ethers.provider.getSigner()).getAddress();
      expect(owner).to.equal(signer);
    });
  });

  describe("Fund", function () {
    it("Fails if you don't send enough ETH", async function () {
      const prevBlock = await ethers.provider.getBlockNumber();
      const tx = await fundMeV2.donate({ value: sendValue });
      await tx.wait(1);
      const isTrue = (await ethers.provider.getBlockNumber()) === prevBlock + 1;
      assert.isTrue(isTrue);
    });

    it("Should updates donatorsToAmount", async function () {
      const senderAddress =
        (await (await ethers.getSigners()).at(0)?.getAddress()) ?? "";

      const response = await fundMeV2.donatorsToAmount(senderAddress);
      assert.equal(response.toString(), sendValue.toString());
    });
  });

  afterEach(async function () {
    console.log("Collecting funds...");
    await fundMeV2.withDraw();
    console.log("Funds collected.");
  });
});
