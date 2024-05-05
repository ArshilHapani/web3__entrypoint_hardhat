import { ethers } from "ethers";
import { create } from "zustand";
import { toast } from "react-hot-toast";

interface WalletInterface {
  balance: number;
  address: string;
  connect: () => Promise<void>;
  setBalance: (balance: number) => void;
  setAddress: (address: string) => void;
  provider?: ethers.Provider;
  isConnected?: boolean;
  isLoading?: boolean;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<void>;
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
  isLoading: false,
  isConnected:
    (typeof window !== "undefined" &&
      window.ethereum &&
      window.ethereum?.isConnected()) ??
    false,
  setBalance: (balance) =>
    set({ balance: Number(ethers.parseEther(balance.toString())) }),
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
        provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        set({ address: signer.address });
        const balance = Number(
          ethers.parseEther(
            (await provider.getBalance(signer.address)).toString()
          )
        );
        set({ balance });
        set({ provider });
        set({ isConnected: window.ethereum.isConnected() });
        toast.success("Connected to Metamask");
      }
    } catch (error: any) {
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
