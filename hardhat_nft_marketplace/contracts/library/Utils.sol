//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

library Utils {
    event ItemListed(
        address indexed owner,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
}
