import { ethers, network } from "hardhat";
import { assert } from "chai";

import { BasicNFT } from "../typechain-types";
import { developmentChains } from "../helper-hardhat-config";
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Test for Basic NFT", () => {
      let basicNFT: BasicNFT;
      beforeEach(async function () {
        const BasicNFTFactory = await ethers.getContractFactory("BasicNFT");
        basicNFT = await BasicNFTFactory.deploy();
        await basicNFT.deploymentTransaction()?.wait(1);
      });

      it("Should deploy the contract", async function () {
        const address = await basicNFT.getAddress();
        assert.notEqual(0, address.length);
      });

      it("Should increase the tokenCounter", async function () {
        const prevTokenCounter = await basicNFT.getTokenCounter();
        const tx = await basicNFT.mintNft();
        await tx.wait(1);
        const currentTokenCounter = await basicNFT.getTokenCounter();
        assert.notEqual(prevTokenCounter, currentTokenCounter);
      });

      it("Should return the token URI", async function () {
        const tokenURI = await basicNFT.tokenURI(0);
        assert.equal(tokenURI, await basicNFT.TOKEN_URI());
      });
    });
