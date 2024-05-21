// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract SimpleStorage {
    event storeNumber(
        uint256 indexed oldNumber,
        uint256 indexed newNumber,
        uint256 addedNumber,
        address sender
    );
    uint256 favNumber;

    function store(uint256 _newNumber) public {
        emit storeNumber(
            favNumber,
            _newNumber,
            favNumber + _newNumber,
            msg.sender
        );
        favNumber = _newNumber;
    }

    function retrieve() public view returns (uint256) {
        return favNumber;
    }
}
