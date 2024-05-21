//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Arshil {
    mapping(string => string) lovers;
    constructor(string memory _love, string memory _lover) {
        lovers[_love] = _lover;
    }
    function getArshil() public pure returns (string memory) {
        return "Arshil";
    }
    function getLover(string memory _love) public view returns (string memory) {
        console.log("Lover of %s is %s", _love, lovers[_love]);
        return lovers[_love];
    }
}
