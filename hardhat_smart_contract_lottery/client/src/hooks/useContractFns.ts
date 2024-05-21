import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";

import useWallet from "./useWallet";

type ContractFnsType<T> = {
  contract: Contract & T;
  error: any;
  isLoading: boolean;
};
interface FunctionParameter {
  contractAddress: string;
  abi: any;
}

function useContractFns<T>({
  abi,
  contractAddress,
}: FunctionParameter): ContractFnsType<T> {
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contract, setContract] = useState<Contract & T>(null as any);
  const {
    provider,
    balance,
    address,
    isConnected,
    isLoading: walletLoading,
    signer,
  } = useWallet();

  useEffect(() => {
    (async function () {
      try {
        setIsLoading(true);
        if (
          provider &&
          signer &&
          address !== "" &&
          balance !== 0 &&
          isConnected &&
          !walletLoading
        ) {
          const contract = new ethers.Contract(
            contractAddress,
            abi,
            signer
          ) as T & Contract;
          setContract(contract);
        }
      } catch (error: any) {
        console.log("Error in useContractFns Hook");
        console.log(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [
    abi,
    address,
    balance,
    contractAddress,
    isConnected,
    provider,
    walletLoading,
    signer,
  ]);

  return { contract, error, isLoading };
}

export default useContractFns;
