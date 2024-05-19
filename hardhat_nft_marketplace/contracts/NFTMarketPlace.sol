//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {NFTMarketPlace__Errors} from "./library/Errors.sol";
import {Utils} from "./library/Utils.sol";

contract NFTMarketPlace {
    // NFT Contract address -> NFT tokenId -> Listing
    mapping(address => mapping(uint256 => Utils.Listing)) private s_listing;

    // Seller address -> amount earned
    mapping(address => uint256) private s_sellers;

    function listItem(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _priceInUsd,
        address _contractAddress
    )
        external
        notListed(_nftAddress, _tokenId, msg.sender)
        isOwner(_nftAddress, _tokenId, msg.sender)
    {
        uint256 priceInEth = Utils.getUsdFromEth(_ethAmount, contractAddress);
        if (_priceInUsd <= 0) {
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
        s_listing[_nftAddress][_tokenId] = Utils.Listing(_price, msg.sender);
        emit Utils.ItemListed(msg.sender, _nftAddress, _tokenId, _price);
    }

    function buyItem(
        address _nftAddress,
        uint256 _tokenId
    ) external payable isListed(_nftAddress, _tokenId) {
        Utils.Listing memory listedItem = s_listing[_nftAddress][_tokenId];
        if (msg.value < listedItem.price) {
            revert NFTMarketPlace__Errors.PriceRequirementNotMeet(
                nftAddress,
                tokenId,
                listedItem.price
            );
        }
        s_proceed[listedItem.seller] += msg.value;

        // after buying this we want to delete the listing
        delete (s_listing[_nftAddress][_tokenId]);
        IERC721(_nftAddress).transferFrom(
            listedItem.seller,
            msg.sender,
            _tokenId
        );
        // At Pull over Push (Make notes...)
    }

    ///////////////////////
    /////// Modifiers//////
    ///////////////////////
    modifier notListed(
        address _nftAddress,
        uint256 _tokenId,
        address _owner
    ) {
        Utils.Listing memory listing = s_listing[_nftAddress][_tokenId];
        if (listing.price > 0) {
            revert NFTMarketPlace__Errors.ItemAlreadyListed(
                _nftAddress,
                _tokenId
            );
        }
        _;
    }

    modifier isOwner(
        address _nftAddress,
        uint256 _tokenId,
        address _spender
    ) {
        IERC721 nft = IERC721(_nftAddress);
        address owner = nft.ownerOf(_tokenId);
        if (owner != _spender) {
            revert NFTMarketPlace__Errors.NotOwner();
        }
        _;
    }

    modifier isListed(address _nftAddress, uint256 _tokenId) {
        Utils.Listing memory listing = s_listing[_nftAddress][_tokenId];
        if (listing.price <= 0) {
            revert NFTMarketPlace__Errors.ItemNotListed(_nftAddress, _tokenId);
        }
        _;
    }
}
