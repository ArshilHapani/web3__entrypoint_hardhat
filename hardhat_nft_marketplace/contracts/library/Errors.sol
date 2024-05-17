//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

library NFTMarketPlace__Errors {
    error PriceMustBeAboveZero();
    error NotApprovedForListing();
    error ItemAlreadyListed(address nftAddress, uint256 tokenId);
}
