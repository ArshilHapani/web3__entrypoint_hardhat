// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./PriceConvertor.sol";

error FundMe__NotOwner();
error FundMe__TransactionFail();
error FundMe__RequireMinEth();

/** @title A contract for crowd funding
 * @author Hapani Arshil
 * @notice You can use this contract to raise funds
 * @dev This implements pricefeed as dependency
 */
contract FundMe {
    using PriceConvertor for uint256;

    address[] public s_funders;
    mapping(address => uint256) public s_fundersToAmount;

    uint256 public constant MIN_USD = 1;
    address public immutable i_owner;
    address public immutable i_contract_address;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address _contract_address) {
        i_owner = msg.sender;
        i_contract_address = _contract_address;
    }
    // receive() external payable {
    //     fund();
    // } a
    // fallback() external payable {
    //     fund();
    // }

    function fund() public payable {
        uint256 convertedEthValue = msg.value.getConversionRate(
            i_contract_address
        );

        if (convertedEthValue < MIN_USD) {
            revert FundMe__RequireMinEth();
        }
        s_funders.push(msg.sender);
        s_fundersToAmount[msg.sender] += msg.value;
    }
    function withdraw() public onlyOwner {
        // every time reading from storage variable
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length; // here
            funderIndex++
        ) {
            address funder = s_funders[funderIndex]; // here
            // Reset the funder's balance to 0
            s_fundersToAmount[funder] = 0; // and here updating
        }
        s_funders = new address[](0);
        (bool isSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");

        if (!isSuccess) {
            revert FundMe__TransactionFail();
        }
    }

    function cheapWithDraw() public payable onlyOwner {
        address[] memory funderCopy = s_funders; // reading once
        // mapping's can't be memory
        for (uint256 i = 0; i < funderCopy.length; i++) {
            address funder = funderCopy[i];
            s_fundersToAmount[funder] = 0;
        }
        s_funders = new address[](0);
        (bool isSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");

        if (!isSuccess) {
            revert FundMe__TransactionFail();
        }
    }
}
