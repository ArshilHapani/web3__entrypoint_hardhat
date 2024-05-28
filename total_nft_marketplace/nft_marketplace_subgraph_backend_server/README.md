# Some basic graph notes

## Graph

- It is the decentralized indexer which indexes the data on the decentralized manner
- Create subgraph from subgraph studio

- [My Dashboard | Subgraph Studio](https://thegraph.com/studio/)

- Initialize the subgraph by following the docs

- [Quick Start](https://thegraph.com/docs/en/quick-start/)

- Write your schemas in `schema.graphql` file.
- e.g.

  ```graphql
  type ActiveItem @entity {
    id: ID! # ID is type and `!` means it is required
    buyer: Bytes! # address
    seller: Bytes!
    nftAddress: Bytes!
    tokenId: BigInt! # uint256
    price: BigInt # not required
  }

  type ItemListed @entity {
    id: ID!
    seller: Bytes!
    nftAddress: Bytes!
    tokenId: BigInt!
    price: BigInt
  }

  type ItemCancelled @entity {
    id: ID!
    seller: Bytes!
    nftAddress: Bytes!
    tokenId: BigInt!
  }

  type ItemBought @entity {
    id: ID!
    buyer: Bytes!
    nftAddress: Bytes!
    tokenId: BigInt!
    price: BigInt
  }
  ```

- Generate types using `graph codegen` command.
  - It generates typescript types
