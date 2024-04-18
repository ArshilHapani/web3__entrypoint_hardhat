// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./PriceConvertor.sol";

error NotOwner();
error TransactionFail();
error RequireMinEth();

contract FundMe {
    using PriceConvertor for uint256;

    address[] public funders;
    mapping(address => uint256) public funderToAmount;

    uint256 public constant MIN_USD = 50 * 1e18;
    address public immutable i_owner;
    address public immutable i_contract_address;

    constructor(address _contract_address) {
        i_owner = msg.sender;
        i_contract_address = _contract_address;
    }

    function fund() public payable {
        uint256 convertedEthValue = msg.value.getConversionRate(
            i_contract_address
        );

        if (convertedEthValue < MIN_USD) {
            revert RequireMinEth();
        }
        funders.push(msg.sender);
        funderToAmount[msg.sender] += msg.value;
    }
    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            // Reset the funder's balance to 0
            funderToAmount[funder] = 0;
        }
        (bool isSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");

        if (!isSuccess) {
            revert TransactionFail();
        }
    }
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    // implementing receive and fallback
    receive() external payable {
        fund();
    }
    fallback() external payable {
        fund();
    }
}
