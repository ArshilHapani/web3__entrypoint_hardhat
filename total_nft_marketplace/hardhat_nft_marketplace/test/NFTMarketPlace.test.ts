import { ethers, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { assert } from "chai";

import { developmentChains } from "../helper-hardhat-config";

import {
  BasicNft,
  type NFTMarketPlace as NFTMarketPlaceType,
} from "../typechain-types";
import { deployFixture } from "../utils/verify";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("MFT MarketPlace Tests Unit", () => {
      let nftMarketPlace: NFTMarketPlaceType;
      const PRICE = ethers.parseEther("100");
      const TOKEN_ID = 0;
      let deployer: string, player: string;
      let basicNFT: BasicNft;
      beforeEach(async function () {
        const { nftMarketPlace: nftMarketPlaceL, basicNFT: basicNFTLc } =
          await loadFixture(deployFixture);
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
        await nftMarketPlace.listItem(nftAddress, TOKEN_ID, PRICE);

        // connecting player to the nft marketplace
        const playerConnectedNftMarketPlace = nftMarketPlace.connect(
          await ethers.getSigner(player)
        );

        // buying item
        await playerConnectedNftMarketPlace.buyItem(nftAddress, TOKEN_ID, {
          value: PRICE,
        });

        // checking that player actually owns the nft
        const newOwner = await basicNFT.ownerOf(TOKEN_ID);

        // checking that deployer actually get paid
        const deployerProceed = await nftMarketPlace.getProceeds(deployer);

        assert(newOwner.toString() == player);
        assert(deployerProceed.toString() == PRICE.toString());
      });
    });
