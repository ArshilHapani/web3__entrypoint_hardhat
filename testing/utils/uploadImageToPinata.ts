import PinataClient, { PinataPinResponse } from "@pinata/sdk";
import path from "path";
import fs from "node:fs";

const pinataAPIKey = process.env.PINATA_API_KEY;
const pinataAPISecret = process.env.PINATA_API_SECRET;
const pinata = new PinataClient(pinataAPIKey, pinataAPISecret);

const metaDataTemplate = {
  name: "",
  description: "",
  images: "",
  attributes: [
    {
      background_color: "",
      year: "",
    },
  ],
};

async function uploadImageToPinata(imagesPath: string) {
  try {
    const fullImagesPath = path.resolve(__dirname, imagesPath);
    const files = fs.readdirSync(fullImagesPath);
    let responses: PinataPinResponse[] = [];
    console.log(`Uploading ${files.length} images to Pinata...`);
    for (let fileIndex in files) {
      console.log(`Uploading ${files[fileIndex]}...`);
      const readableStream = fs.createReadStream(
        `${fullImagesPath}/${files[fileIndex]}`
      );
      const res = await pinata.pinFileToIPFS(readableStream, {
        pinataMetadata: {
          name: files[fileIndex],
        },
      });
      responses.push(res);
    }
    console.log(`Uploaded ${files.length} images to Pinata`);
    return { files, responses };
  } catch (error: any) {
    console.error(`Error in uploadImageToPinata: ${error}`);
    throw new Error(error);
  }
}

export async function storeTokenUriMetaData(
  imagePath: string
): Promise<[string, string, string]> {
  let tokenUris: [string, string, string] = ["", "", ""];
  const { files, responses } = await uploadImageToPinata(imagePath);

  await Promise.all(
    responses.map(async (response, index) => {
      let newMetaData: typeof metaDataTemplate = { ...metaDataTemplate };
      newMetaData.name = files[index].replace(".jpeg", "");
      newMetaData.description = `This is a ${newMetaData.name} NFT `;
      newMetaData.images = `ipfs://${response.IpfsHash}`;
      console.log(`Uploading metadata for ${newMetaData.name}...`);
      const res = await storeMetaDataToPinata(newMetaData);
      tokenUris[index] = `ipfs://${res.IpfsHash}`;
    })
  );
  console.log(`Meta data uploaded to Pinata`);
  console.log(tokenUris);
  return tokenUris;
}

async function storeMetaDataToPinata(metaData: typeof metaDataTemplate) {
  try {
    const res = await pinata.pinJSONToIPFS(metaData);
    return res;
  } catch (error: any) {
    console.error(`Error in storeMetaDataToPinata: ${error}`);
    throw new Error(error);
  }
}
