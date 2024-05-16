// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConvertor {
    function getCurrentEthPrice(
        address contractAddress
    ) internal view returns (int256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            contractAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();

        return price;
    }

    function getConversionRate(
        uint256 _ethAmount,
        address contractAddress
    ) internal view returns (int256) {
        int256 ethPrice = getCurrentEthPrice(contractAddress);
        int256 ethAmountInUsd = (ethPrice * int256(_ethAmount)) / 1e18;
        return ethAmountInUsd;
    }
}
