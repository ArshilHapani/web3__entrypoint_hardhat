# DeFi Smart Contract Interaction

1. Programmatically deposit collateral into a DeFi protocol: ETH/ WETH
2. Borrow another asset: DAI
3. Repay the DAI

## WETH

WETH is an ERC20 token that represents Ether. It is a standard ERC20 token with a few additional methods to convert between Ether and WETH. WETH is used in DeFi protocols to represent Ether, as it is an ERC20 token and can be used in smart contracts.

## Forking Blockchain

Forking blockchain means creating a copy of the blockchain at a specific block height. This allows developers to test their smart contracts on a blockchain that is identical to the mainnet, but with the ability to control the state of the blockchain. This is useful for testing smart contracts that interact with DeFi protocols, as it allows developers to test their contracts in a controlled environment without risking real funds.

Refer [here](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks#forking-from-mainnet)
