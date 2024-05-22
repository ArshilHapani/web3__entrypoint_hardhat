import { ethers } from "hardhat";

const PRICE = ethers.parseEther("100");
(async function () {
  const basicNFTFactory = await ethers.getContractFactory("BasicNft");
  const basicNFT = await basicNFTFactory.deploy();
  await basicNFT.deploymentTransaction()?.wait(1);
  const owner = (await (await ethers.getSigners()).at(0)?.getAddress()) ?? "";
  const player = (await (await ethers.getSigners()).at(1)?.getAddress()) ?? "";

  const nftMarketPlaceFactory = await ethers.getContractFactory(
    "NFTMarketPlace"
  );
  const nftMarketPace = await nftMarketPlaceFactory.deploy({
    from: owner,
  });
  await nftMarketPace.deploymentTransaction()?.wait(1);

  console.log(`🚀 Contracts deployed...`);
  const tx = await basicNFT.mintNft({ from: owner });
  const txReceipt = await tx.wait(1);
  const tokenId = (txReceipt?.logs[1] as any).args[0];

  const tx1 = await basicNFT.approve(await nftMarketPace.getAddress(), tokenId);
  await tx1.wait(1);

  const nftAddress = await basicNFT.getAddress();
  console.log(`NFT Address: ${nftAddress}`);
  console.log(`Old owner ${await basicNFT.ownerOf(tokenId)}`);

  console.log("Listing item in Marketplace");
  const tx2 = await nftMarketPace.listItem(nftAddress, tokenId, PRICE);
  const txReceipt2 = await tx2.wait(1);
  const logs = (txReceipt2?.logs as any[]).map((item) => item.args);
  // console.log(logs); // prints sender nft address tokenId price

  const newNftMarketPlace = nftMarketPace.connect(
    await ethers.getSigner(player)
  );

  // buying item
  const tx3 = await newNftMarketPlace.buyItem(nftAddress, tokenId, {
    value: PRICE,
  });
  const txReceipt3 = await tx3.wait(1);
  const logs1 = await (txReceipt3?.logs[1] as any).args;
  console.log("Bought item...");
  // console.log(logs1); // msg.sender , nftAddress, tokenId, price
  const newOwner = await basicNFT.ownerOf(tokenId);
  console.log({ newOwner });

  const deploymentProceeds = await nftMarketPace.getProceeds(owner);
  console.log({ deploymentProceeds });
})();
/**
 * 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 acc 1
 * 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 acc 2
 */
