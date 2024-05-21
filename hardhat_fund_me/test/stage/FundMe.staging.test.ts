import { ethers, network } from "hardhat";
import { assert } from "chai";

import { FundMe } from "../../typechain-types";
import { developmentChains, netWorkConfig } from "../../helper-hardhat-config";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe Staging test", function () {
      let fundMe: FundMe;
      let ownerAddress: string;
      const sendValue = ethers.parseEther("0.03");
      const parameter =
        netWorkConfig[network.config.chainId ?? 80002].ethUsdPriceFeed;
      beforeEach(async function () {
        ownerAddress = (await ethers.getSigners())[0].address;
        fundMe = await ethers
          .getContractFactory("FundMe")
          .then((contract) => contract.deploy(parameter));
        await fundMe.waitForDeployment();
      });

      it("Allow people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue });
        await fundMe.deploymentTransaction()?.wait(2);

        const endingBalance = await ethers.provider.getBalance(
          fundMe.getAddress()
        );

        assert(endingBalance.toString(), "0");
      });

      afterEach(async function () {
        await fundMe.withdraw();
        const balance = await ethers.provider.getBalance(fundMe.getAddress());
        assert(balance.toString(), "0");
      });
    });
