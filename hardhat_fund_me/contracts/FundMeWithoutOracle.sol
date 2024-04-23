//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

error FundMeV2__NotOwner();
error FundMeV2__TransactionFail();
error FundMeV2__RequireMinEth();

contract FundMeV2 {
    address[] public donators;
    mapping(address => uint256) public donatorsToAmount;

    uint256 public constant MIN_ETH = 1;
    address public immutable owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "FundMe__NotOwner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function donate() public payable {
        uint256 convertedEthValue = msg.value;

        if (convertedEthValue < MIN_ETH) {
            revert FundMeV2__RequireMinEth();
        }
        donators.push(msg.sender);
        donatorsToAmount[msg.sender] += msg.value;
    }

    function withDraw() public onlyOwner {
        for (
            uint256 donatorIndex = 0;
            donatorIndex < donators.length;
            donatorIndex++
        ) {
            address donator = donators[donatorIndex];
            donatorsToAmount[donator] = 0;
        }
        (bool isSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");

        if (!isSuccess) {
            revert FundMeV2__TransactionFail();
        }
    }
}
