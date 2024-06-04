# web3\_\_entrypoint

This repo contains following projects:

- simple smart contract interaction with ethers (ethers_simpleStorage) (only smart contract)
- testing for event logging (events_logging) (only smart contract)
- decentralized finance using hardhat to convert `weth` to `eth` and vice versa using `aave` protocol (only smart contract)
- ethereum `ERC20` for making custom tokens (hardhat_erc20)
- simple crowdfunding hardhat_fund_me (hardhat_fund_me)
- total `NFT` guide (hardhat_nft)
- simple storage using hardhat (hardhat_simple_storage)
- decentralized lottery with chainlink `VRF` and `Keepers` (automation) (hardhat_smart_contract_lottery)
- frontend integration with `fund_me` contract (html_fund_me)
- NFT market place with total NFT tutorial
  - `graph_nft_marketplace` - Frontend part of graph integration for indexing events
  - `hardhat_nft_marketplace` - Backend (contract) part of NFT Marketplace
  - `nft_marketplace_moralis` - Hate to admit it but frontend part using moralis (which sucks)
  - `nft_marketplace_subgraph_backend_server` - Backend server setup and configuration for graph
  - `self_hosted_server_moralis` - Server for moralis
- Hardhat Upgrades
  - `hardhat_upgrades` - Hardhat upgrades for smart contracts
  - It includes proxies, transparent proxies, and upgradeable contracts

# Auditing and security

The two most common attack:

- Reentrancy
- Oracle Manipulation

Before you deploy anything always

- Run slither
- look manually for oracle manipulation examples or reentrancy attacks

main apparently
changes made in development
changes 2 made in development
changes 3 made in development
changes 4 made in development
changes 5 made in development
changes 6 made in development
