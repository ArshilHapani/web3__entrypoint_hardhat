// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

// only the owner can interact with the contract
contract Box is Ownable {
    uint256 private _value;

    event ValueChanged(uint256 value);
    constructor() {}

    function store(uint256 value) public onlyOwner {
        _value = value;
        emit ValueChanged(value);
    }

    function retrieve() public view returns (uint256) {
        return _value;
    }
}
