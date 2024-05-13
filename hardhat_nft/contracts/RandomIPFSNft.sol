// SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract RandomIPFSNft {
    function requestNFT() public {}
    function fullFillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal {}

    function tokenURI(uint256 tokenId) public {}
}
