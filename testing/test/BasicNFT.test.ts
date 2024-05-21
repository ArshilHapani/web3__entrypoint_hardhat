import { ethers, ignition, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { assert } from "chai";

import { developmentChains } from "../helper-hardhat-config";
import BasicNFT from "../ignition/modules/02-BasicNFT";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe.skip("Basic NFT Unit Tests", () => {
      let basicNft: any;
      let deployer: string;
      beforeEach(async function () {
        basicNft = await loadFixture(basicNft);
        deployer =
          (await (await ethers.getSigners()).at(0)?.getAddress()) ?? "";
      });

      describe("Constructor", () => {
        it("should intitialize the constructor", async () => {
          const name = (await basicNft?.name()) ?? "Dogie";
          const symbol = (await basicNft?.symbol()) ?? "DOG";
          const tokenCounter = await basicNft.getTokenCounter();
          assert.equal(name, "Dogie");
          assert.equal(symbol, "DOG");
          assert.equal(tokenCounter.toString(), "0");
        });
      });
    });

async function deployFixture() {
  const { basicNFT } = await ignition.deploy(BasicNFT);
  return { basicNFT };
}
