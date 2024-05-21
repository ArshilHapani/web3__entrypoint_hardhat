// SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

error RandomIPFSNft__RequireMinFee();
error RandomIPFSNft__WithdrawFailed();
error RandomIPFSNft__ContractAlreadyInitialized();

contract RandomIPFSNft is VRFConsumerBaseV2, ERC721URIStorage, Ownable {
    enum CollectionList {
        GOLD,
        SILVER,
        LEGENDARY
    }

    event NftRequested(uint256 indexed _requestId, address _requestAddress);
    event NftMinted(CollectionList collection, address minter);

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATION = 3;
    uint32 private constant NUM_WORdS = 1;

    // VRF helper
    mapping(uint256 => address) public s_requestIdToSender;

    // NFT variables
    uint256 public s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 50;
    string[] internal s_collectionTokenUris;
    uint256 internal i_mintFee;
    bool private s_isInitialized;

    constructor(
        address vrfConsumerBaseV2,
        uint64 _subscriptionId,
        bytes32 _gasLane,
        uint32 _callbackGasLimit,
        string[3] memory _tokenUris,
        uint256 _mintFee
    )
        VRFConsumerBaseV2(vrfConsumerBaseV2)
        ERC721("SpotifyCollectives", "SPC")
        Ownable()
    {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfConsumerBaseV2);
        i_subscriptionId = _subscriptionId;
        i_gasLane = _gasLane;
        i_callbackGasLimit = _callbackGasLimit;
        _initializeContract(_tokenUris);
        i_mintFee = _mintFee;
    }

    function _initializeContract(string[3] memory _tokenUris) private {
        if (s_isInitialized) {
            revert RandomIPFSNft__ContractAlreadyInitialized();
        }
        s_collectionTokenUris = _tokenUris;
        s_isInitialized = true;
    }

    function requestNFT() public payable returns (uint256 requestId) {
        if (msg.value < i_mintFee) {
            revert RandomIPFSNft__RequireMinFee();
        }
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATION,
            i_callbackGasLimit,
            NUM_WORdS
        );
        s_requestIdToSender[requestId] = msg.sender;
        emit NftRequested(requestId, msg.sender);
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert RandomIPFSNft__WithdrawFailed();
        }
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address nftOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
        s_tokenCounter++;

        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        /**
         * n is between 0 - 20 -> 20% chance
         * n is between 20 - 50 -> 30% chance
         * n is between 50 - 100 -> 50% chance
         */
        CollectionList cl = getCollectionFromModdedRng(moddedRng);
        _safeMint(nftOwner, newTokenId);
        _setTokenURI(newTokenId, s_collectionTokenUris[uint256(cl)]);

        emit NftMinted(cl, nftOwner);
    }

    function getCollectionFromModdedRng(
        uint256 moddedRng
    ) public pure returns (CollectionList) {
        uint256[3] memory chanceArray = getChanceArray();
        if (moddedRng < chanceArray[0]) {
            return CollectionList.GOLD;
        } else if (moddedRng < chanceArray[1]) {
            return CollectionList.SILVER;
        } else {
            return CollectionList.LEGENDARY;
        }
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [30, 20, MAX_CHANCE_VALUE];
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getCollectionUri(
        uint256 _index
    ) public view returns (string memory) {
        return s_collectionTokenUris[_index];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getInitialized() public view returns (bool) {
        return s_isInitialized;
    }
}
