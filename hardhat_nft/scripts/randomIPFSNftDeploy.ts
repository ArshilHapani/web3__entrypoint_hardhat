import { network } from "hardhat";
import getSigner from "../utils/getSigner";
import { developmentChains, netWorkConfig } from "../helper-hardhat-config";
import deployMocks from "../utils/deployMocks";
import { uploadImageToNFTStorage } from "../utils/uploadImageToIPFS";

const chainId = network.config.chainId ?? 31337;

(async function () {
  const deployer = await getSigner();

  let vrfCoordinatorV2Address: string = "",
    subscriptionId: string = "";
  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await deployMocks();
    vrfCoordinatorV2Address = await vrfCoordinatorV2Mock.getAddress();

    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = await tx.wait(1);
    subscriptionId = (txReceipt?.logs[0] as any).args[0] as string;
  } else {
    vrfCoordinatorV2Address = netWorkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = netWorkConfig[chainId].subscriptionId;
  }

  console.log("---------------------------------------------");
  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    netWorkConfig[chainId].keyHash,
    netWorkConfig[chainId].mintFee,
    netWorkConfig[chainId].callbackGasLimit,
  ];
})();
