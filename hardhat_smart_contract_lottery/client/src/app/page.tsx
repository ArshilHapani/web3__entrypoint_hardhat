import data from "../../../hardhat_lottery_contracts/artifacts/contracts/Lottery.sol/Lottery.json";

import LotteryEntrance from "@/components/LotteryEntrance";

export default function Home() {
  return (
    <main className="py-10">
      <LotteryEntrance abi={data.abi} />
    </main>
  );
}
