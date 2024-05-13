import { viem } from "hardhat";

const baseFee = BigInt(2e18);
const basePriceLink = BigInt(1e8);

(async function () {
  const mockVRFFactory = await viem.deployContract(
    "VRFCoordinatorV2Mock",
    [baseFee, basePriceLink],
    { confirmations: 1 }
  );
  const tx = await mockVRFFactory.simulate.createSubscription();
  const subId = tx.result;
  console.log(`Subscription ID: ${subId}`);
  //   await mockVRFFactory.simulate.fundSubscription([subId, baseFee]);
  //   await mockVRFFactory.simulate.addConsumer([subId, mockVRFFactory.address]);
  //   const fullFillRnd = await mockVRFFactory.simulate.fulfillRandomWords([
  //     subId,
  //     mockVRFFactory.address,
  //   ]);
})();
