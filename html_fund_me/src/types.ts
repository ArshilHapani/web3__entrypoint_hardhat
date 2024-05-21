import detectEthereumProvider from "@metamask/detect-provider";

export type MetamaskProviderType = Awaited<
  ReturnType<typeof detectEthereumProvider>
>;
