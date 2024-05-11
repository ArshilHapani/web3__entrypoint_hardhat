import { ethers } from "hardhat";

import type { Signer } from "../scripts/aaveBorrow";
import { ILendingPool } from "../typechain-types";

export class AaveHelper {
  async getLendingPool(account: Signer | undefined) {
    const lendingPoolAddressProvider = await ethers.getContractAt(
      "ILendingPoolAddressesProvider",
      "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
      account
    );
    const lendingPoolAddress =
      await lendingPoolAddressProvider.getLendingPool();
    const lendingPool = await ethers.getContractAt(
      "ILendingPool",
      lendingPoolAddress,
      account
    );
    return lendingPool;
  }

  async approveErc20(
    erc20Address: string,
    spenderAddress: string,
    amountToSpend: bigint | string,
    account: Signer | undefined
  ) {
    const etc20Token = await ethers.getContractAt(
      "IERC20",
      erc20Address,
      account
    );
    const tx = await etc20Token.approve(spenderAddress, amountToSpend);
    await tx.wait(1);
    console.log("Approved!");
  }

  async getBorrowedUserData(
    signer: Signer | undefined,
    lendingPool: ILendingPool
  ) {
    const [totalCollateralETH, totalDebtETH, availableBorrowsETH] =
      await lendingPool.getUserAccountData(signer?.address ?? "");

    console.log(
      `You have ${ethers.formatEther(
        totalCollateralETH
      )} worth of ETH deposited`
    );
    console.log(
      `You have ${ethers.formatEther(totalDebtETH)} worth of ETH borrowed`
    );
    console.log(
      `You can borrow ${ethers.formatEther(availableBorrowsETH)} worth of ETH`
    );
    return {
      totalDebtETH,
      availableBorrowsETH, // it is always less than totalCollateralETH because of the LTV
    };
  }

  async getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
      "AggregatorV3Interface",
      "0x773616E4d11A78F511299002da57A0a94577F1f4"
    ); // we won't connect to deployer as we are just reading the data (sending needs deployer)
    const price = (await daiEthPriceFeed.latestRoundData())[1];
    console.log("DAI price: ", ethers.formatUnits(price, 8));
    return price;
  }

  async borrowDai(
    daiAddress: string,
    lendingPool: ILendingPool,
    amountDaiToBorrowWei: bigint,
    account: Signer | undefined
  ) {
    const borrowTx = await lendingPool.borrow(
      daiAddress,
      amountDaiToBorrowWei,
      2,
      0,
      account ?? ""
    );
    AaveHelper;
    await borrowTx.wait(1);
    console.log(`Borrowed ${ethers.formatEther(amountDaiToBorrowWei)} DAI!`);
  }

  async repay(
    amount: bigint,
    daiAddress: string,
    lendingPool: ILendingPool,
    account: Signer | undefined
  ) {
    // repay the borrowed amount (we need to approve before we can repay)
    await this.approveErc20(
      daiAddress,
      await lendingPool.getAddress(),
      amount,
      account
    );

    const repayTx = await lendingPool.repay(
      daiAddress,
      amount,
      2,
      account ?? ""
    );
    await repayTx.wait(1);
    console.log("Repay!");
  }
}
