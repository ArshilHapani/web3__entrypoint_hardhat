import { ethers, network } from "hardhat";

import getSigner from "../utils/getSigner";
import { developmentChains, netWorkConfig } from "../helper-hardhat-config";
import deployMocks from "../utils/deployMocks";
import { storeTokenUriMetaData } from "../utils/uploadImageToPinata";
import verifyContract from "../utils/verify";

const chainId = network.config.chainId ?? 31337;

let tokenUris: [string, string, string] = [
  "ipfs://QmQFZA28w4GrgysQDMRVBZz1zuicosmNuzro1xZcbwc4Le",
  "ipfs://QmTiS8qcYifMhVnvvRDjautbK4WnEv7sQVvsgLbyU3uesv",
  "ipfs://QmPvvsDu1cbuet7x9Ptu6yT7TWnbFYvLgk7PnGNmFfNLzF",
];

(async function () {
  if (process.env.UPLOAD_PINATA_FLAG === "true") {
    tokenUris = await storeTokenUriMetaData("../images/randomNFTs");
  }

  let vrfCoordinatorV2Address: string = "",
    subscriptionId: string = "";
  if (developmentChains.includes(network.name)) {
    ({ address: vrfCoordinatorV2Address, subscriptionId } =
      await deployMocks());
  } else {
    vrfCoordinatorV2Address = netWorkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = netWorkConfig[chainId].subscriptionId;
  }

  console.log("---------------------------------------------");
  await deployRandomIPFSNft(vrfCoordinatorV2Address, subscriptionId);
})();

export async function deployRandomIPFSNft(
  vrfCoordinatorV2Address: string,
  subscriptionId: string
) {
  const deployer = await getSigner();
  const randomIPFSNftFactory = await ethers.getContractFactory("RandomIPFSNft");
  const randomIPFSNft = await randomIPFSNftFactory.deploy(
    vrfCoordinatorV2Address,
    subscriptionId,
    netWorkConfig[chainId].keyHash,
    netWorkConfig[chainId].callbackGasLimit,
    tokenUris,
    netWorkConfig[chainId].mintFee,
    { from: await deployer?.getAddress() }
  );
  await randomIPFSNft.deploymentTransaction()?.wait(1);
  const contractAddress = await randomIPFSNft.getAddress();
  console.log(`RandomIPFSNft deployed to: ${contractAddress}`);
  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    netWorkConfig[chainId].keyHash,
    netWorkConfig[chainId].callbackGasLimit,
    tokenUris,
    netWorkConfig[chainId].mintFee,
  ];
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    console.log(`Verifying contract on Etherscan.....`);
    await verifyContract(contractAddress, args);
  }
  return randomIPFSNft;
}
