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
  private signer: Signer | undefined = undefined;
  private nftAddress: string;
  private contract: Contract;

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
      await this.contract.listItem(
        newNftAddress.toString(),
        tokenId,
        ethers.utils.parseUnits(price.toString())
      );
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
      await this.contract.cancelItem(this.nftAddress, tokenId);
      return true;
    } catch (error: any) {
      console.error(error);
      return false;
    }
  }
  async updatePrice(tokenId: number, price: string) {
    try {
      await this.contract.updateListing(
        this.nftAddress,
        tokenId,
        ethers.utils.parseUnits(price),
        {
          gasLimit: 5000000,
        }
      );
      return true;
    } catch (error: any) {
      console.error(error);
      return false;
    }
  }

  async buyNFT(tokenId: number, price: string) {
    try {
      await this.contract.buyItem(this.nftAddress, tokenId, {
        gasLimit: 5000000,
        value: ethers.utils.parseUnits(price),
      });
      return true;
    } catch (error: any) {
      console.error(error);
      return false;
    }
  }
  async withDrawProceeds() {
    try {
      await this.contract.withDrawProceed();
      return true;
    } catch (error: any) {
      console.error(error);
      return false;
    }
  }
}
