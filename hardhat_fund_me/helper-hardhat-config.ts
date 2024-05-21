const netWorkConfig: {
  [key: number]: {
    name: string;
    ethUsdPriceFeed: string;
  };
} = {
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x1a81afB8146aeFfCFc5E50e8479e826E7D55b910",
  },
  97: {
    name: "bnb test net",
    ethUsdPriceFeed: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",
  },
  80002: {
    name: "amony",
    ethUsdPriceFeed: "0xF0d50568e3A7e8259E16663972b11910F89BD8e7",
  },
  1337: {
    name: "ethereum ganache",
    ethUsdPriceFeed: "0x1a81afB8146aeFfCFc5E50e8479e826E7D55b910",
  },
};

const developmentChains = ["hardhat", "localhost", "ganache"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

export { netWorkConfig, developmentChains, DECIMALS, INITIAL_ANSWER };
