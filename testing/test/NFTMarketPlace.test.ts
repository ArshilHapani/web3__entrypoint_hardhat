import { ethers, ignition, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { assert, expect } from "chai";

import { developmentChains } from "../helper-hardhat-config";
import NFTMarketPlace from "../ignition/modules/01-NFTMarketPlace";

import {
  BasicNft,
  type NFTMarketPlace as NFTMarketPlaceType,
} from "../typechain-types";
import MockV3Aggregator from "../ignition/modules/00-DeployMocks";
import BasicNFT from "../ignition/modules/02-BasicNFT";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("MFT MarketPlace Tests Unit", () => {
      let nftMarketPlace: NFTMarketPlaceType;
      const PRICE_USD = 100; // IN USD (we have used oracles)
      const PRICE_ETH = ethers.parseEther("100");
      const TOKEN_ID = 0;
      let deployer: string, player: string;
      let mockV3AggregatorAddress: string = "";
      let basicNFT: BasicNft;
      beforeEach(async function () {
        const {
          nftMarketPlace: nftMarketPlaceL,
          basicNFT: basicNFTLc,
          mockV3,
        } = await loadFixture(deployFixture);
        mockV3AggregatorAddress = (await mockV3.getAddress()) ?? "";
        basicNFT = basicNFTLc as any;
        nftMarketPlace = nftMarketPlaceL as any;
        deployer =
          (await (await ethers.getSigners()).at(0)?.getAddress()) ?? "";
        player = (await (await ethers.getSigners()).at(1)?.getAddress()) ?? "";
        await basicNFT.mintNft(); // each nft have it's own contract (basicNft), and nftMarket place manages the addresses of that nft
        await basicNFT.approve(await nftMarketPlace.getAddress(), TOKEN_ID);
      });

      it("Lists NFT and can be bought", async function () {
        const nftAddress = await basicNFT.getAddress();

        // listing item
        await nftMarketPlace.listItem(
          nftAddress,
          TOKEN_ID,
          PRICE_USD,
          mockV3AggregatorAddress
        );

        // connecting player to the nft marketplace
        const playerConnectedNftMarketPlace = nftMarketPlace.connect(
          await ethers.getSigner(player)
        );

        // buying item
        await nftMarketPlace.buyItem(nftAddress, TOKEN_ID, {
          value: PRICE_ETH,
        });

        // checking that player actually owns the nft
        const newOwner = await basicNFT.ownerOf(TOKEN_ID);

        // checking that deployer actually get paid
        const deployerProceed = await nftMarketPlace.getProceeds(deployer);

        assert(newOwner.toString() == player);
        assert(deployerProceed.toString() == PRICE_ETH.toString());
      });
    });

async function deployFixture() {
  const { nftMarketPlace } = await ignition.deploy(NFTMarketPlace);
  const { mockV3 } = await ignition.deploy(MockV3Aggregator);
  const { basicNFT } = await ignition.deploy(BasicNFT);
  return { nftMarketPlace, mockV3, basicNFT };
}
