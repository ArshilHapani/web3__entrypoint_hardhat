//SPDX-License-Identifier:MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    // mintDelay: the minimum delay for a proposal to be executed
    // proposers: the list of addresses that can propose a new proposal
    // executors: the list of addresses that can execute a proposal
    // admin: the address that can add or remove proposers and executors
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) TimelockController(minDelay, proposers, executors, msg.sender) {}
}
