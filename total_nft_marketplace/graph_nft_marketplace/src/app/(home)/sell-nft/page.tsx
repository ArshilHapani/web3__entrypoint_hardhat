"use client";

import { useThirdwebConnectedWalletContext } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Heading from "@/components/Heading";
import TextField from "@/components/TextField";

import useContract from "@/hooks/useContract";

type FormSchema = {
  nftAddress: string;
  tokenId: number;
  price: number;
};

export default function SellNFT() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: {
      nftAddress: "",
      tokenId: 0,
      price: 0,
    },
  });
  const { wallet, signer, address } = useThirdwebConnectedWalletContext();
  const [proceeds, setProceeds] = useState(BigNumber.from(0));
  const [loading, setLoading] = useState(false);
  const ct = useContract("");

  useEffect(() => {
    (async function () {
      if (address) {
        const proceeds = await ct.getProceeds();
        setProceeds(proceeds);
      }
    })();
  }, [address, ct, signer, wallet]);

  async function onSubmit(values: FormSchema) {
    setLoading(true);
    let flg = await ct.listNFT(values.nftAddress, values.tokenId, values.price);
    if (flg) {
      toast.success("NFT Listed successfully...");
    } else {
      toast.error("Failed to list NFT. Please provide valid NFT address", {
        duration: 6000,
      });
    }
    setLoading(false);
  }
  async function withdrawProceeds() {
    toast.promise(
      new Promise(async (res, rej) => {
        const flg = await ct.withDrawProceeds();
        if (flg) res(true);
        else rej(false);
      }),
      {
        loading: "Withdrawing proceeds...",
        success: "Proceeds withdrawn successfully... Changes will reflect soon",
        error: "Failed to withdraw proceeds",
      }
    );
  }
  return (
    <div>
      <Heading title="Sell NFT" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 border lg:w-[70%] w-full rounded-lg px-10 py-6"
      >
        <TextField<FormSchema>
          label="NFT Address"
          name="nftAddress"
          register={register}
          required
          errorMessage="Valid NFT Address is required"
          type="text"
          placeholder="Enter your nft address.. 0xt44..."
          isInvalid={!!errors.nftAddress}
          // isAddress
          disabled={loading}
        />
        <TextField<FormSchema>
          label="Token ID"
          name="tokenId"
          register={register}
          required
          errorMessage="Token ID is required"
          type="number"
          placeholder="Enter your token ID.. 421..."
          isInvalid={!!errors.tokenId}
          disabled={loading}
        />
        <TextField<FormSchema>
          label="Price in ETH"
          name="price"
          register={register}
          required
          errorMessage="Price is required"
          type="text"
          placeholder="Enter your NFT price 0.4 ETH..."
          isInvalid={!!errors.price}
          disabled={loading}
        />
        <button className="btn btn-solid" type="submit" disabled={loading}>
          List NFT To MarketPlace
        </button>
      </form>

      <Heading title="Proceeds" className="mt-6" />
      <div className="space-y-3 border lg:w-[70%] w-full rounded-lg px-10 py-6">
        <h1 className="text-3xl font-bold text-gray-500">Available Proceeds</h1>
        {proceeds == BigNumber.from(0) ? (
          <h3 className="text-xl font-semibold mt-2 text-gray-700">
            No proceeds available
          </h3>
        ) : (
          <h1 className="text-xl font-semibold mt-2 text-gray-700">
            {ethers.utils.formatUnits(proceeds)} ETH <br />
            <button
              // disabled={proceeds <= BigNumber.from(0.99)}
              className="btn btn-outline mt-3 tooltip"
              // data-tip={`${
              //   proceeds <= BigNumber.from(0.99)
              //     ? "Require minimum 1 ETH"
              //     : "Withdraw"
              // }`}
              onClick={withdrawProceeds}
            >
              Withdraw
            </button>
          </h1>
        )}
      </div>
    </div>
  );
}
