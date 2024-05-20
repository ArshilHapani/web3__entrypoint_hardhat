//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {NFTMarketPlace__Errors} from "./library/Errors.sol";
import {Utils} from "./library/Utils.sol";

contract NFTMarketPlace is ReentrancyGuard {
    // NFT Contract address -> NFT tokenId -> Listing
    mapping(address => mapping(uint256 => Utils.Listing)) private s_listings;

    // Seller address -> amount earned
    mapping(address => uint256) private s_proceeds;

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
        uint256 priceInEth = Utils.getUsdFromEth(_priceInUsd, _contractAddress);
        if (priceInEth <= 0) {
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
        s_listings[_nftAddress][_tokenId] = Utils.Listing(
            priceInEth,
            msg.sender
        );
        emit Utils.ItemListed(msg.sender, _nftAddress, _tokenId, priceInEth);
    }

    function buyItem(
        address _nftAddress,
        uint256 _tokenId
    ) external payable isListed(_nftAddress, _tokenId) nonReentrant {
        // to prevent reentrance do all of your state changes before calling withdraw or transfer functions
        Utils.Listing memory listedItem = s_listings[_nftAddress][_tokenId];
        if (msg.value < listedItem.price) {
            revert NFTMarketPlace__Errors.PriceRequirementNotMeet(
                _nftAddress,
                _tokenId,
                listedItem.price
            );
        }
        // it is further used to withdraw the money
        s_proceeds[listedItem.seller] += msg.value;

        // after buying this we want to delete the listing
        delete (s_listings[_nftAddress][_tokenId]);
        IERC721(_nftAddress).safeTransferFrom(
            listedItem.seller,
            msg.sender,
            _tokenId
        );
        /* At Pull over Push https://fravoll.github.io/solidity-patterns/pull_over_push.html
         sending the money to the user ❌
         have them withdraw money ✅ */

        emit Utils.ItemBought(
            msg.sender,
            _nftAddress,
            _tokenId,
            listedItem.price
        );
    }

    function cancelItem(
        address _nftAddress,
        uint256 _tokenId
    )
        external
        isOwner(_nftAddress, _tokenId, msg.sender)
        isListed(_nftAddress, _tokenId)
    {
        delete (s_listings[_nftAddress][_tokenId]);
        emit Utils.ItemCancelled(msg.sender, _nftAddress, _tokenId);
    }

    function updateListing(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _newPrice
    )
        external
        isListed(_nftAddress, _tokenId)
        isOwner(_nftAddress, _tokenId, msg.sender)
    {
        s_listings[_nftAddress][_tokenId].price = _newPrice;
        emit Utils.ItemListed(msg.sender, _nftAddress, _tokenId, _newPrice);
    }

    function withDrawProceed() external nonReentrant {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NFTMarketPlace__Errors.NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            revert NFTMarketPlace__Errors.TransferFailed();
        }
    }

    ///////////////////////
    //////////Getters//////
    ///////////////////////

    function getListing(
        address _nftAddress,
        uint256 _tokenId
    ) external view returns (Utils.Listing memory) {
        return s_listings[_nftAddress][_tokenId];
    }

    function getProceeds(address _seller) external view returns (uint256) {
        return s_proceeds[_seller];
    }
    ///////////////////////
    /////// Modifiers//////
    ///////////////////////
    modifier notListed(
        address _nftAddress,
        uint256 _tokenId,
        address _owner
    ) {
        Utils.Listing memory listing = s_listings[_nftAddress][_tokenId];
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
        Utils.Listing memory listing = s_listings[_nftAddress][_tokenId];
        if (listing.price <= 0) {
            revert NFTMarketPlace__Errors.ItemNotListed(_nftAddress, _tokenId);
        }
        _;
    }
}
