import { gql } from "@apollo/client";

export const getActiveItems = gql`
  {
    activeItems(
      first: 5
      where: { buyer: "0x0000000000000000000000000000000000000000" }
    ) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;

export function getMyNFTs(address: string) {
  return gql`  
  {    
    activeItems(
      where: { seller:  "${address}" }
    ) {
      id
      seller
      nftAddress
      tokenId
      price
      buyer
    }    
  }
`;
}
