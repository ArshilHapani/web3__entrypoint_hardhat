//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {NFTMarketPlace__Errors} from "./library/Errors.sol";

contract NFTMarketPlace {
    struct Listing {
        uint256 price;
        address seller;
    }
    mapping(address => mapping(uint256 => Listing)) private s_listing;

    function listItem(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price
    ) external {
        if (_price <= 0) {
            revert NFTMarketPlace__Errors.PriceMustBeAboveZero();
        }
        /**
         * We can list the item in 2 ways
         * 1. Send the NFT to the contract. Transfer -> Contract "hold" the NFT (Gas expensive)
         * 2. Owners can still hold their NFT, and give the marketplace approval to sell the NFT for them.
         */
        IERC721 nft = IERC721(_nftAddress);
        if (nft.getApproved(_tokenId) != address(this)) {
            revert NFTMarketPlace__Errors.NotApprovedForListing();
        }
        s_listing[_nftAddress][_tokenId] = Listing(_price, msg.sender);
    }
}
