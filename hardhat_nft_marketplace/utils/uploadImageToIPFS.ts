import { NFTStorage, File } from "nft.storage";
import mime from "mime";
import fs from "fs";
import path from "path";

// we can do that using 2 method
// 1. With our own IPFS node. https://docs.ipfs.io/
// 2. Pinata https://www.pinata.cloud/

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_API_KEY ?? "";

export async function uploadImageToNFTStorage(imagesPath: string) {
  const fullImagesPath = path.resolve(imagesPath);
  const files = fs.readdirSync(fullImagesPath);
  const responses = [];
  for (const fileIndex in files) {
    const image = await fileFromPath(`${fullImagesPath}/${files[fileIndex]}`);
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
    // const dogName = files[fileIndex].replace(".png", "")
    const dogName = files[fileIndex].split(".")[0];
    const response = await nftstorage.store({
      image,
      name: dogName,
      description: `An adorable ${dogName}`,
      // Currently doesn't support attributes 😔
      // attributes: [{ trait_type: "cuteness", value: 100 }],
    });
    responses.push(response);
  }
  return responses;
}

async function fileFromPath(filePath: string) {
  const content = await fs.promises.readFile(filePath);
  const type = mime.getType(filePath) ?? undefined;
  return new File([content], path.basename(filePath), { type });
}
