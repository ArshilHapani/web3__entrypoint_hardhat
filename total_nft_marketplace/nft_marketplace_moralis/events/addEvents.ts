import Moralis from "moralis";
type CreateStreamOptions = Parameters<typeof Moralis.Streams.add>[0];
const EVMChains = Moralis.EvmUtils.EvmChain;

try {
  (async function () {
    await Moralis.start({
      apiKey: "", // remove this
      defaultNetwork: "Evm",
      evmApiBaseUrl: "http://localhost:1337/server",
      logLevel: "debug",
    });
    const ItemListedOptions: CreateStreamOptions = {
      chains: [EVMChains.ETHEREUM],
      description: "Listen for ItemListed events",
      tag: "ItemListed",
      webhookUrl: "http://localhost:3000/webhook",
      includeAllTxLogs: true,
      topic0: ["ItemListed(address,address,uint256,uint256)"],
      abi: {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "nftAddress",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
        ],
        name: "ItemListed",
        type: "event",
      },
      networkType: "evm",
      demo: true,
    };
    Moralis.Streams.add(ItemListedOptions);
  })();

  console.log("Moralis initialized");
} catch (error) {
  console.error(error);
}
