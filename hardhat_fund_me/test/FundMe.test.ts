import { expect } from "chai";
import { ethers, network } from "hardhat";

import { deployFundMe } from "../scripts/deploy";
import { netWorkConfig } from "../helper-hardhat-config";

import type {
  FundMe,
  FundMe__factory,
  MockV3Aggregator,
  MockV3Aggregator__factory,
} from "../typechain-types";

describe("FundMe", function () {
  let fundMeFactory: FundMe__factory;
  let fundMe: FundMe;
  let mockV3AggregatorFactory: MockV3Aggregator__factory;
  let mockV3Aggregator: MockV3Aggregator;
  const parameter = netWorkConfig[network.config.chainId ?? 1].ethUsdPriceFeed;

  beforeEach(async function () {
    fundMeFactory = await deployFundMe();
    fundMe = await fundMeFactory.deploy(parameter);
  });
  // constructor tests
  describe("constructor", function () {
    beforeEach(async function () {
      mockV3AggregatorFactory = await ethers.getContractFactory(
        "MockV3Aggregator"
      );
      mockV3Aggregator = await mockV3AggregatorFactory.deploy(18, 200000000000);
    });
    it("Set the aggregator address correctly", async function () {
      const passedAddress = await fundMe.i_owner();
      const expectedAddress = await mockV3Aggregator.getAddress();
      expect(passedAddress, "Aggregator address is not set correctly").to.equal(
        expectedAddress
      );
    });
  });
});
