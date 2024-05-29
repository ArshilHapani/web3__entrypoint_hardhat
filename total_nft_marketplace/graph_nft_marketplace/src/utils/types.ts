export type ReturnedData = {
  activeItems: {
    buyer: string;
    id: string;
    nftAddress: string;
    price: string;
    seller: string;
    tokenId: string;
    __typename: string;
  }[];
};
export type MyNFTApolloReturnData = {
  activeItems: {
    id: string;
    nftAddress: string;
    price: string;
    seller: string;
    tokenId: string;
    __typename: string;
    buyer: string;
  }[];
};
