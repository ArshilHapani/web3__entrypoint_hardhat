// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract imple {
    uint256 public val;
    mapping(address => uint256) dnt;

    function setVal(uint256 _newVal) public payable {
        val = _newVal;
        dnt[msg.sender] = msg.value;
    }
}

contract proxy {
    uint256 public myVal;
    mapping(address => uint256) public dnt;

    function setMyVal() public {
        myVal = 70;
    }

    function testDelegateCall(address _contract, uint256 _val) public payable  {
        (bool success, ) = _contract.delegatecall(
            abi.encodeWithSignature("setVal(uint256)", _val)
        );
        require(success, "Failed to execute delegateCall");
    }
}
