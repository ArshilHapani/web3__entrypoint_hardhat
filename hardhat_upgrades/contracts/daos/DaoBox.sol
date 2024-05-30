//SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MyDao {
    uint256 public value;

    function setValue(uint256 _value) public {
        value = _value;
    }
    function retrieveValue() public view returns (uint256) {
        return value;
    }
}
