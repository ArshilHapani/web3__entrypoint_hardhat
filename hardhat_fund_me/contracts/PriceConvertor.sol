// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


library PriceConvertor {
  function getCurrentEthPrice(
    address contractAddress
  ) internal view returns (uint256) {
    AggregatorV3Interface priceFeed = AggregatorV3Interface(contractAddress);
    (, int256 price, , , ) = priceFeed.latestRoundData();

    return uint256(price);
  }

  function getConversionRate(
    uint256 _ethAmount,
    address contractAddress
  ) internal view returns (uint256) {
    uint256 ethPrice = getCurrentEthPrice(contractAddress);
    uint256 ethAmountInUsd = (ethPrice * _ethAmount) / 1e18;
    return ethAmountInUsd;
  }
}
