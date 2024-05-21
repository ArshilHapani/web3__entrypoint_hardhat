import { ethers, network } from "hardhat";
import { expect, assert } from "chai";

import { RandomIPFSNft, VRFCoordinatorV2Mock } from "../typechain-types";
import deployMocks from "../utils/deployMocks";
import { deployRandomIPFSNft } from "../scripts/randomIPFSNftDeploy";
import { developmentChains, netWorkConfig } from "../helper-hardhat-config";
import getSigner from "../utils/getSigner";

const chainId = network.config.chainId ?? 31337;
let MINT_FEES = netWorkConfig[chainId].mintFee;

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Test For Random IPFS NFT Contract", () => {
      let randomIPFSNFT: RandomIPFSNft;
      let mockVrfCoordinator: VRFCoordinatorV2Mock;
      let mockAddress: string;
      let subscriptionId: string;
      let deployerAddress: string;

      beforeEach(async function () {
        ({
          address: mockAddress,
          subscriptionId,
          mockVrfCoordinator,
        } = await deployMocks());
        randomIPFSNFT = await deployRandomIPFSNft(mockAddress, subscriptionId);
        deployerAddress =
          (await getSigner().then(
            async (signer) => await signer?.getAddress()
          )) ?? "";
      });

      describe("Deployment", () => {
        it("Should deploy RandomIPFSNft contract", async () => {
          expect((await randomIPFSNFT.getAddress()).length).to.not.equal(0);
        });
      });
      describe("Constructor", function () {
        it("Should initialize the constructor", async function () {
          const uri = await randomIPFSNFT.getCollectionUri(0);
          const isInitialized = await randomIPFSNFT.getInitialized();
          assert(uri.startsWith("ipfs://"));
          expect(isInitialized).to.equal(true);
        });
      });

      describe("Request NFT", () => {
        it("Should revert if not enough mint fees is sended", async function () {
          const mintFee = await randomIPFSNFT.getMintFee();
          expect(randomIPFSNFT.requestNFT({ value: 0 })).to.be.revertedWith(
            "Not enough fees sent"
          );
          expect(
            randomIPFSNFT.requestNFT({ value: mintFee - 10n })
          ).to.be.revertedWith("Not enough fees sent");
        });
        it("Should emit an event", async function () {
          expect(randomIPFSNFT.requestNFT({ value: MINT_FEES })).to.emit(
            randomIPFSNFT,
            "NftRequested"
          );
        });
      });
      describe("fulfillRandomWords", () => {
        it.skip("mints NFT after random number is returned", async function () {
          await new Promise(async (resolve, reject) => {
            randomIPFSNFT.once(
              "NftMinted" as any,
              async (tokenId, breed, minter) => {
                try {
                  const tokenUri = await randomIPFSNFT.tokenURI(
                    tokenId.toString()
                  );
                  const tokenCounter = await randomIPFSNFT.getTokenCounter();
                  const collectionUri = await randomIPFSNFT.getCollectionUri(
                    breed.toString()
                  );
                  assert.equal(tokenUri.toString().includes("ipfs://"), true);
                  assert.equal(collectionUri.toString(), tokenUri.toString());
                  assert.equal(
                    +tokenCounter.toString(),
                    +tokenId.toString() + 1
                  );
                  assert.equal(minter, deployerAddress);
                  resolve(true);
                } catch (e) {
                  console.log(e);
                  reject(e);
                }
              }
            );
            try {
              const fee = await randomIPFSNFT.getMintFee();
              const requestNftResponse = await randomIPFSNFT.requestNFT({
                value: fee.toString(),
              });
              const requestNftReceipt = await requestNftResponse.wait(1);
              await mockVrfCoordinator.fulfillRandomWords(
                (requestNftReceipt?.logs[1] as any).args[0],
                randomIPFSNFT.getAddress()
              );
            } catch (e) {
              console.log(e);
              reject(e);
            }
          });
        });

        it.skip("should withdraw the amount to the owner's account ", async () => {
          const ownerBalanceBefore = await ethers.provider.getBalance(
            deployerAddress
          );
          const fee = await randomIPFSNFT.getMintFee();
          await randomIPFSNFT.requestNFT({ value: fee });
          await mockVrfCoordinator.fulfillRandomWords(
            (
              await randomIPFSNFT.requestNFT({ value: fee })
            ).hash,
            randomIPFSNFT.getAddress()
          );
          const ownerBalanceAfter = await ethers.provider.getBalance(
            deployerAddress
          );
          assert.equal(
            +ownerBalanceAfter.toString(),
            +ownerBalanceBefore.toString() + +fee.toString()
          );
        });
      });
    });
