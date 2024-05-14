//SPDX-License-Identifier:MIT
pragma solidity version ^0.8.17;

import {VRFConsumerBaseV2, VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

import "hardhat/console.sol";

contract TestVRF is VRFConsumerBaseV2{
    event wordFound(uint256[] words);
    constructor (address _vrfCoordinator) VRFConsumerBaseV2(_vrfCoordinator) {
        
    }
    function fulfillRandomWords(uint256 reqId,uint256[] memory _randomWords) internal override {
        emit wordFound(_randomWords);
    }
}