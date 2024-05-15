# NFT Ultimate Guide

1. Basic NFT (ERC721)
   - Creates simple NFT using openzeppelin
2. Random IPFS NFT
   - When we mint an NFT, we will trigger a Chainlink VRF call to get us random number
   - Using that number we will get a random NFT
   - They will get random NFT from IPFS
   - User have to pay for minting NFT
   - Owner of the NFT can withdraw the ETH

- **Pros**: Cheap
- **Cons**: Someone needs to pin our data

3. Dynamic SVG NFT (100% onChain)

- **Pros**: Data is onChain
- **Cons**: Much more expensive

If price of ETH is above X -> Happy face
If price of ETH is below X -> Sad face

We can do everything from scratch, similarly like ERC20 in the past but we have used openzeppelin for ERC20.

Similarly, we can use openzeppelin for ERC721.
[Read more](https://docs.openzeppelin.com/contracts/4.x/erc721)

# To upload images on IPFS we can use two services

1. With our own IPFS node. https://docs.ipfs.io/
2. Pinata https://www.pinata.cloud/
