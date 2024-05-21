"use client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";

import { CONTRACT_ADDRESS } from "@/utils/constant";
import useContractFns from "@/hooks/useContractFns";

import { ethers } from "ethers";

const LotteryEntrance = ({ abi }: { abi: any[] }) => {
  const { contract, isLoading } = useContractFns({
    abi: JSON.stringify(abi),
    contractAddress: CONTRACT_ADDRESS.sepolia,
  });
  const [entranceFee, setEntranceFee] = useState("0");
  const [loading, setLoading] = useState(false);
  const [numPlayers, setNumPlayers] = useState(0);
  const [recentWinner, setRecentWinner] = useState("Not available");

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        if (contract) {
          try {
            const entranceFee = await contract.getEntranceFee();
            const numPlayers = await contract.getNumberOfPlayers();
            const recentWinner = await contract.getRecentWinner();
            setRecentWinner(recentWinner);
            setNumPlayers(Number(numPlayers._hex));
            setEntranceFee(entranceFee._hex);
          } catch (er: any) {
            console.log(er);
            toast.error(er.message);
          }
        } else {
          toast("Please connect wallet", {
            icon: <TriangleAlert />,
            style: {
              backgroundColor: "yellow",
            },
          });
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [contract]);

  async function enterLottery() {
    try {
      setLoading(true);
      if (contract) {
        const tx = await contract.enterLottery({
          value: entranceFee,
        });
        await tx.wait(1);
        toast.success("Entered lottery successfully");
      } else {
        toast.error("Please connect wallet");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {entranceFee === "0" && CONTRACT_ADDRESS ? (
        <div>Not connected to wallet</div>
      ) : (
        <div>
          <label htmlFor="label">
            Entrance Fee: {ethers.utils.formatEther(entranceFee)} ETH
          </label>
          <br />
          <label htmlFor="label" className="my-2">
            Number of Players: {numPlayers}
          </label>
          <br />
          <label htmlFor="label" className="my-2">
            Recent Winner: {recentWinner}
          </label>
          <br />
          <button
            className="btn mt-4 btn-outline"
            onClick={enterLottery}
            disabled={isLoading || loading}
          >
            {loading ? "Entering..." : "Enter Lottery"}
          </button>
        </div>
      )}
    </div>
  );
};

export default LotteryEntrance;
