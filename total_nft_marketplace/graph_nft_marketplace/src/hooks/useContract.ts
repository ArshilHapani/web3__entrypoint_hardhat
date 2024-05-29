import { Web3NFTUtils } from "@/utils/web3";
import { useThirdwebConnectedWalletContext } from "@thirdweb-dev/react";

export default function useContract(nftAddress: string) {
  const { signer } = useThirdwebConnectedWalletContext();
  const web3 = new Web3NFTUtils(signer, nftAddress);
  return web3;
}
