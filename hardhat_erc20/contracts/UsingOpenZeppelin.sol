// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ArshilToken is ERC20 {
    /**
        Initial Supply 50 -> 50 WEI
        ERC20 Comes with decimal function, by default it is 18
        50 Token = 50e18 = 50 * 10^18 = 50 WEI
     */
    constructor(uint256 initialSupply) ERC20("ArshilToken", "AT") {
        _mint(msg.sender, initialSupply);
    }
}
