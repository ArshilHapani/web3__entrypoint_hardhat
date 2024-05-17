//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

import {NFTMarketPlace__Errors} from "./Errors.sol";

library Utils {
    ///////////////////////
    /////// Structures/////
    ///////////////////////
    struct Listing {
        uint256 price;
        address seller;
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

    ///////////////////////
    ////////Modifiers//////
    ///////////////////////
    modifier notListed(
        address _nftAddress,
        uint256 _tokenId,
        address _owner,
        mapping(address => mapping(uint256 => Listing)) storage s_listing
    ) {
        Listing memory listing = s_listing[_nftAddress][_tokenId];
        if (listing.price > 0) {
            revert NFTMarketPlace__Errors.ItemAlreadyListed(
                _nftAddress,
                _tokenId
            );
        }
        _;
    }
}
