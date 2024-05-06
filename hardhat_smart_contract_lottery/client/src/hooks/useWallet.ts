import { create } from "zustand";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";

interface WalletInterface {
  balance: number;
  address: string;
  connect: () => Promise<void>;
  setBalance: (balance: number) => void;
  setAddress: (address: string) => void;
  provider?:
    | ethers.providers.Web3Provider
    | ethers.providers.BaseProvider
    | any;
  isConnected?: boolean;
  isLoading?: boolean;
  signer?: ethers.Signer | any;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      selectedAddress?: string;
      removeListener: (
        event: string,
        callback: (accounts: string[]) => void
      ) => void;
      enable: () => Promise<string[]>;
      isConnected: () => boolean;
      isMetaMask: boolean;
    };
  }
}

const useWallet = create<WalletInterface>((set) => ({
  balance: 0,
  address: "",
  provider: undefined,
  signer: undefined,
  isLoading: false,
  isConnected:
    (typeof window !== "undefined" &&
      window.ethereum &&
      window.ethereum?.isConnected()) ??
    false,
  setBalance: (balance) =>
    set({ balance: Number(ethers.utils.formatEther(balance.toString())) }),
  setAddress: (address) => set({ address }),
  async connect() {
    try {
      set({ isLoading: true });
      let provider;
      if (window.ethereum == null) {
        toast.error("Metamask not found using default provider");
        provider = ethers.getDefaultProvider();
        set({ provider });
      } else {
        await window.ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then(async (accounts) => {
            provider = new ethers.providers.Web3Provider(
              window?.ethereum as any
            );
            const signer = accounts[0];
            const balance = Number(
              ethers.utils.formatEther(
                (await provider.getBalance(signer)).toString()
              )
            );
            set({ address: signer });
            set({ signer: provider.getSigner(signer) });
            set({ balance });
            set({ provider });
            set({ isConnected: window?.ethereum?.isConnected() });
            toast.success("Connected to Metamask");
          });
      }
    } catch (error: any) {
      console.error(error);
      if (error?.info?.error?.code === 4001) {
        toast.error("User denied connection request");
      } else {
        toast.error("An error occurred while connecting to Metamask");
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useWallet;
