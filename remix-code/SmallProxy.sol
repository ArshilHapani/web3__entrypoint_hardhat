// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AssemblyTest {
    uint256 public v;

    function setV() public returns (uint256) {
        assembly {
            let x := add(sload(v.slot),10)
            sstore(v.slot,x)
        }                
        return v;
    }
}
