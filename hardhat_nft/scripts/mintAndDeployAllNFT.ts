import { ethers, network } from "hardhat";

import { netWorkConfig } from "../helper-hardhat-config";
import getSigner from "../utils/getSigner";
import { deployBasicNFT } from "./basicNFTDeploy";
import { deployRandomIPFSNft } from "./randomIPFSNftDeploy";
import { deployDynamicSVGNFT } from "./dynamicNFTDeploy";

const chainId = network.config.chainId ?? 31337;

(async function () {
  const signer = await getSigner().then((signer) => signer?.address ?? "");

  // basic nft
  const basicNFT = deployBasicNFT();
  const basicNFTTx = await (await basicNFT).mintNft();
  await basicNFTTx.wait(1);
  console.log(`Token URI: ${await (await basicNFT).tokenURI(0)}`);

  // random IPFS NFT

  //   const randomNFT = await deployRandomIPFSNft(
  //     netWorkConfig[chainId].vrfCoordinatorV2,
  //     netWorkConfig[chainId].subscriptionId
  //   );
  //   const mintFee = await randomNFT.getMintFee();
  //   const randomNFTTx = await randomNFT.requestNFT({ value: mintFee });
  //   await randomNFTTx.wait(1);
  //   console.log(`Random NFT deployed to: ${await randomNFT.tokenURI(0)}`);

  // dynamic SVG NFT
  const dynamicSVGNFT = await deployDynamicSVGNFT(
    netWorkConfig[chainId].priceFeedAddress,
    signer
  );
  const dynamicSVGNFTTx = await dynamicSVGNFT.mintNFT(
    ethers.parseEther((0.01).toString())
  );
  await dynamicSVGNFTTx.wait(1);
  console.log(
    `Dynamic SVG NFT deployed to: ${await dynamicSVGNFT.tokenURI(0)}`
  );
})();
