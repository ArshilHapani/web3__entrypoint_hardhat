import { ethers } from "hardhat";
import { deployFixture } from "../utils/verify";

const PRICE = ethers.parseEther("10");

(async function () {
  const { basicNFT: fixtureBasicNFT, nftMarketPlace: fixtureNftMarketPlace } =
    await deployFixture();
  const [deployer, player] = await ethers.getSigners();
  const nftMarketPlace = await ethers.getContractAt(
    "NFTMarketPlace",
    await fixtureNftMarketPlace.getAddress(),
    deployer
  );
  const basicNFT = await ethers.getContractAt(
    "BasicNft",
    await fixtureBasicNFT.getAddress(),
    deployer
  );
  console.log("Minting...");
  const mintTx = await basicNFT.mintNft();
  const mintTxReceipt = await mintTx.wait(1);
  const tokenId = (mintTxReceipt?.logs[1] as any).args[0];

  console.log("Approving NFT...");
  const approvalTx = await basicNFT.approve(
    nftMarketPlace.getAddress(),
    tokenId
  );
  await approvalTx.wait(1);
  console.log("Listing nft...");
  const tx = await nftMarketPlace.listItem(
    await basicNFT.getAddress(),
    tokenId,
    PRICE
  );
  await tx.wait(1);
  console.log("Listed!✅");
})();
