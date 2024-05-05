import { Contract, ethers } from "ethers";
import { useState } from "react";

type ContractFnsType<T> = {
  contract: Contract & T;
  error: any;
  isLoading: boolean;
};
interface FunctionParameter {
  functionName?: string;
  contractAddress: string;
  abi: any;
  provider: ethers.Provider;
}

function useContractFns<T>({
  abi,
  contractAddress,
}: FunctionParameter): ContractFnsType<T> {
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contract, setContract] = useState<Contract & T>(null as any);

  try {
    setIsLoading(true);
    const contract = new ethers.Contract(contractAddress, abi) as T & Contract;
    setContract(contract);
  } catch (error: any) {
    setError(error);
  } finally {
    setIsLoading(false);
  }

  return { contract, error, isLoading };
}

export default useContractFns;
