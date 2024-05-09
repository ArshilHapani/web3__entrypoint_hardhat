import { viem } from "hardhat";

export default async function getWeth() {
  const deployer =
    (await viem.getWalletClients()).at(0)?.account.address ?? "0x";
  // address 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
  // abi ✅

  const iWeth = await viem.getContractAt(
    "IWeth",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    { client: { wallet: { account: { address: deployer } } } }
  );
  await iWeth.simulate.deposit({ value: 1e18 });
}
