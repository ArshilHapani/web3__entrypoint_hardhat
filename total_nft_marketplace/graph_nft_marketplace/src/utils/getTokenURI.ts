import { Signer, ethers } from "ethers";
import abis from "@/constants/ABI.json";

export default async function getTokenURI(
  nftAddress: string,
  tokenId: string,
  signer: Signer | undefined
) {
  const contract = new ethers.Contract(nftAddress, abis.BasicNftABI, signer);
  return (await contract.tokenURI(tokenId)) as string;
}
