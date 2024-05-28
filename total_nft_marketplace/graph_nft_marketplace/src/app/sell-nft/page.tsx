"use client";

import Heading from "@/components/Heading";
import TextField from "@/components/TextField";
import { useForm } from "react-hook-form";

type FormSchema = {
  nftAddress: string;
  tokenId: string;
  price: string;
};

export default function SellNFT() {
  const { register, handleSubmit } = useForm<FormSchema>({
    defaultValues: {
      nftAddress: "",
      tokenId: "",
      price: "0",
    },
  });
  async function onSubmit(values: FormSchema) {
    console.log({ values });
  }
  return (
    <div>
      <Heading title="Sell NFT" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 border w-[70%] rounded-lg px-10 py-6"
      >
        <TextField<FormSchema>
          label="NFT Address"
          name="nftAddress"
          register={register}
          required
          errorMessage="NFT Address is required"
          type="text"
          placeholder="Enter your nft address.. 0xt44..."
        />
        <TextField<FormSchema>
          label="Token ID"
          name="tokenId"
          register={register}
          required
          errorMessage="Token ID is required"
          type="text"
          placeholder="Enter your token ID.. 421..."
        />
        <TextField<FormSchema>
          label="Price"
          name="price"
          register={register}
          required
          errorMessage="Price is required"
          type="text"
          placeholder="Enter your NFT price 0.4 ETH..."
        />
        <button className="btn btn-solid" type="submit">
          List NFT To MarketPlace
        </button>
      </form>

      <Heading title="Proceeds" className="mt-6" />
      {/* TODO */}
    </div>
  );
}
