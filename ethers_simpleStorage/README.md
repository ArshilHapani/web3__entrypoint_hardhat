# Different code versions

### Signing raw transaction

```ts
import { ethers } from "ethers";
import fs from "fs-extra";

async function deployContract(
  abi: string,
  binaries: string,
  wallet: ethers.Wallet
) {
  const contractFactory = new ethers.ContractFactory(abi, binaries, wallet);
  console.log("Deploying contract...");

  return await contractFactory.deploy();
}

async function main() {
  // http://127.0.0.1:7545

  // compile them in our code
  // compile them separately

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  const wallet = new ethers.Wallet(
    "0xafeebd6b2c3af9521bb3490c4353101f13ae780feab70e453c8164dbc44ea22e", // use .env variables here
    provider
  );
  const abi = fs.readFileSync("./AnimeCharacters_sol_Arshil.abi", "utf8");
  const binaries = fs.readFileSync("./AnimeCharacters_sol_Arshil.bin", "utf8");

  const contract = await deployContract(abi, binaries, wallet);

  const transactionReceipt = await contract.deploymentTransaction()?.wait(1);
  console.log("Deployment transaction");
  console.log(contract.deploymentTransaction());
  console.log("Deployed receipt");
  console.log(transactionReceipt);
  console.log("Deploying using transaction data");
  const nonce = await wallet.getNonce();
  const tx: ethers.TransactionLike = {
    nonce,
    gasPrice: 20000000000,
    gasLimit: 1000000,
    to: null,
    value: 0,
    data: `0x${binaries}`,
    chainId: 1337,
  };
  // const signedTxResponse = await wallet.signTransaction(tx); // signing the transaction
  const sendTxResponse = await wallet.sendTransaction(tx); // sending the transaction
  await sendTxResponse.wait(1);
  console.log(sendTxResponse);
}

try {
  main().then(() => process.exit(0));
} catch (error: any) {
  console.error(error);
  process.exit(1);
}
```
