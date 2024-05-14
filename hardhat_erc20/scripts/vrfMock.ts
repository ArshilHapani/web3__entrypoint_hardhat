import { viem } from "hardhat";

const baseFee = BigInt(2000000000000000000n);
const basePriceLink = BigInt(1e8);
(async function () {
  try {
    const mockVRFFactory = await viem.deployContract("VRFCoordinatorV2Mock", [
      baseFee,
      basePriceLink,
    ]);
    const tx = await mockVRFFactory.simulate.createSubscription();
    const subId = tx.result;
    console.log(`Subscription ID: ${subId}`);
    await mockVRFFactory.simulate.fundSubscription([1n, baseFee]);
    // await mockVRFFactory.simulate.addConsumer([subId, mockVRFFactory.address]);
    //   const fullFillRnd = await mockVRFFactory.simulate.fulfillRandomWords([
    //     subId,
    //     mockVRFFactory.address,
    //   ]);
  } catch (error: any) {
    console.error(error.message);
  }
})();
