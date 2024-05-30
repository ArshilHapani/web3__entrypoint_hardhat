// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Box {
    uint256 internal value;

    event ValueChanged(uint256 newValue);

    function store(uint256 _newValue) public {
        value = _newValue;
        emit ValueChanged(_newValue);
    }

    function retrieve() public view returns (uint256) {
        return value;
    }

    function version() public pure returns (uint256) {
        return 1;
    }
}
