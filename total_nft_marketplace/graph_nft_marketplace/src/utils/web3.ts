import { BigNumber, Contract, Signer, ethers } from "ethers";

import abis from "@/constants/ABI.json";
import addresses from "@/constants/addresses.json";

/**
 * For Basic NFT Contract
 */
export async function getTokenURI(
  nftAddress: string,
  tokenId: string,
  signer: Signer | undefined
) {
  const contract = new ethers.Contract(nftAddress, abis.BasicNftABI, signer);
  return (await contract.tokenURI(tokenId)) as string;
}
/**
 * For NFT MarketPlace Contract
 */
export class Web3NFTUtils {
  signer: Signer | undefined = undefined;
  nftAddress: string;
  contract: Contract;

  constructor(signer: Signer | undefined, nftAddress: string) {
    this.signer = signer;
    this.nftAddress = nftAddress;
    this.contract = new ethers.Contract(
      addresses.NFTMarketPlace,
      abis.NftMarketPlace,
      signer
    );
  }

  async getProceeds() {
    const address = (await this.signer?.getAddress()) ?? "";
    return (await this.contract.getProceeds(address)) as BigNumber;
  }

  async listNFT(newNftAddress: string, tokenId: number, price: number) {
    try {
      console.log({
        newNftAddress,
        price: ethers.utils.parseUnits(price.toString()).toBigInt(),
      });
      console.log(this.contract.interface.format());
      const tx = await this.contract.listItem(
        newNftAddress.toString(),
        tokenId,
        ethers.utils.parseUnits(price.toString())
      );
      console.log({ tx });
      return true;
    } catch (error: any) {
      console.error(error);
      return false;
    }
  }
  async getAddress() {
    return (await this.signer?.getAddress()) ?? "";
  }

  async archiveNFT(tokenId: string) {
    try {
      const tx = await this.contract.cancelItem(this.nftAddress, tokenId);
      console.log({ tx });
      return true;
    } catch (error: any) {
      console.error(error);
      return false;
    }
  }
}

/**
 * 0x3f768f96c58188b58b23b2d1a03fbaaf55e0e36f
 * 2
 */
