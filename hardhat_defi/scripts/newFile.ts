import { ethers } from "hardhat";
import { AaveHelper } from "../utils/Helper";
import getWeth, { AMOUNT } from "./getWeth";

(async function () {
  const h = new AaveHelper();
  await getWeth();
  const deployer = (await ethers.getSigners()).at(0);

  // Lending pool address provider	Mainnet - 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
  const lendingPool = await h.getLendingPool(deployer);
  console.log("Lending pool address: ", await lendingPool.getAddress());

  // deposit
  // webtoken address 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
  const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  //   approve
  await h.approveErc20(
    wethTokenAddress,
    await lendingPool.getAddress(),
    AMOUNT,
    deployer
  );
  console.log("Depositing....");
  await lendingPool.deposit(
    wethTokenAddress,
    AMOUNT,
    (await deployer?.getAddress()) ?? "",
    0
  );
  console.log("Deposited!");

  let { availableBorrowsETH, totalDebtETH } = await h.getBorrowedUserData(
    deployer,
    lendingPool
  );
  const daiPrice = await h.getDaiPrice();
  // Big float in js
  const amountToBorrow =
    Number(availableBorrowsETH.toString()) *
    0.95 * // we are borrowing 95% of the available amount
    (1 / Number(daiPrice.toString()));
  console.log(`You can borrow ${amountToBorrow} DAI`);

  const amountDaiToBorrow = ethers.parseEther(amountToBorrow.toString());
  // available Borrowed ETH ?? What the conversion rate on DAI is?
  // Borrow time!!!
  // how much we have borrowed, how much we have in collateral, how much we can borrow
  const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  await h.borrowDai(daiTokenAddress, lendingPool, amountDaiToBorrow, deployer);

  // nice clean syntax
  ({ availableBorrowsETH, totalDebtETH } = await h.getBorrowedUserData(
    deployer,
    lendingPool
  ));

  console.log("Repaying...");
  await h.repay(totalDebtETH, daiTokenAddress, lendingPool, deployer);
})();
