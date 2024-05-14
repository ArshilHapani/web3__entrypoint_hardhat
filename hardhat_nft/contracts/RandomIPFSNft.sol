// SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RandomIPFSNft is VRFConsumerBaseV2, ERC721 {
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

    constructor(
        address vrfConsumerBaseV2,
        uint64 _subscriptionId,
        bytes32 _gasLane,
        uint32 _callbackGasLimit
    ) VRFConsumerBaseV2(vrfConsumerBaseV2) ERC721("SpotifyCollectives", "SPC") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfConsumerBaseV2);
        i_subscriptionId = _subscriptionId;
        i_gasLane = _gasLane;
        i_callbackGasLimit = _callbackGasLimit;
    }

    function requestNFT() public returns (uint256 requestId) {
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATION,
            i_callbackGasLimit,
            NUM_WORdS
        );
        s_requestIdToSender[requestId] = msg.sender;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address nftOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
        _safeMint(nftOwner, newTokenId);
    }

    function getChanceArray() public pure returns (uint256[3] memory) {}

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {}
}
