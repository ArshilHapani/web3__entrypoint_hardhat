//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

library NFTMarketPlace__Errors {
    error PriceMustBeAboveZero();
    error NotApprovedForListing();
    error ItemAlreadyListed(address nftAddress, uint256 tokenId);
    error NotOwner();
    error ItemNotListed(address nftAddress, uint256 tokenId);
    error PriceRequirementNotMeet(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    );
    error NoProceeds();
    error TransferFailed();
}
