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

    address[] public funders;
    mapping(address => uint256) public funderToAmount;

    uint256 public constant MIN_USD = 50 * 1e18;
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
            revert FundMe__TransactionFail();
        }
    }
    function getCurrentEthPrice() public view returns (uint256) {
        return PriceConvertor.getCurrentEthPrice(i_contract_address);
    }
}
