//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

error FundMeV2__NotOwner();
error FundMeV2__TransactionFail();
error FundMeV2__RequireMinEth();

contract FundMeV2 {
    address[] public s_donators;
    mapping(address => uint256) public s_donatorsToAmount;

    uint256 public constant MIN_ETH = 1;
    address public immutable i_owner;

    modifier onlyOwner() {
        require(msg.sender == i_owner, "FundMe__NotOwner");
        _;
    }

    constructor() {
        i_owner = msg.sender;
    }

    function donate() public payable {
        uint256 convertedEthValue = msg.value;

        if (convertedEthValue < MIN_ETH) {
            revert FundMeV2__RequireMinEth();
        }
        s_donators.push(msg.sender);
        s_donatorsToAmount[msg.sender] += msg.value;
    }

    function withDraw() public onlyOwner {
        for (
            uint256 donatorIndex = 0;
            donatorIndex < s_donators.length;
            donatorIndex++
        ) {
            address donator = s_donators[donatorIndex];
            s_donatorsToAmount[donator] = 0;
        }
        (bool isSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");

        if (!isSuccess) {
            revert FundMeV2__TransactionFail();
        }
    }
    function cheapWithDraw() public payable onlyOwner {
        address[] memory funderCopy = s_donators; // reading once
        // mapping's can't be memory
        for (uint256 i = 0; i < funderCopy.length; i++) {
            address funder = funderCopy[i];
            s_donatorsToAmount[funder] = 0;
        }
        s_donators = new address[](0);
        (bool isSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");

        if (!isSuccess) {
            revert FundMeV2__TransactionFail();
        }
    }
    function getDonators() public view returns (address[] memory) {
        return s_donators;
    }
}
