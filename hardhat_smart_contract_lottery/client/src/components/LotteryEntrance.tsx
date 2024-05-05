"use client";

import { ethers } from "ethers";

import { CONTRACT_ADDRESS } from "@/utils/constant";
import useWallet from "@/hooks/useWallet";
import { Lottery } from "../../../hardhat_lottery_contracts/typechain-types";

const LotteryEntrance = ({ abi }: any) => {
  const { provider } = useWallet();
  async function trigger() {
    const contract: Lottery = new ethers.Contract(
      CONTRACT_ADDRESS,
      abi,
      provider
    ) as any;
    console.log({ contract });
    const res = await contract.getLatestTimeStamp();
    console.log({ res });
  }

  return (
    <div>
      <button onClick={trigger}>Trigger</button>
    </div>
  );
};

export default LotteryEntrance;
