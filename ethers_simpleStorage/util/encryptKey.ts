import { ethers } from "ethers";
import fs from "fs-extra";

async function main() {
  const wallet = new ethers.Wallet(process.env.WALLET_SECRET_KEY!);
  const encryptedKey = await wallet.encrypt(process.env.WALLET_SECRET_KEY!);
  console.log(encryptedKey);
  fs.writeFileSync("./.encryptedKey.json", encryptedKey);
}

await main();
