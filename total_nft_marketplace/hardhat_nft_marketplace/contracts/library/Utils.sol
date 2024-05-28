//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

import {NFTMarketPlace__Errors} from "./Errors.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library Utils {
    ///////////////////////
    ////////Structures/////
    ///////////////////////
    struct Listing {
        uint256 price;
        address seller;
    }

    ///////////////////////
    ////////Function///////
    ///////////////////////
    function getCurrentEthPrice(
        address contractAddress
    ) internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            contractAddress
        );
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

    ///////////////////////
    /////// Events/////////
    ///////////////////////
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemBought(
        address indexed seller, // it is buyer
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    event ItemCancelled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );
}
