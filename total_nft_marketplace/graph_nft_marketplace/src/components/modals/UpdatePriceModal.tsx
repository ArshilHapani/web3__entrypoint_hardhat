"use client";

import Modal from "./Modal";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import useContract from "@/hooks/useContract";

import TextField from "../TextField";
import useModal from "@/hooks/useModal";

type Props = {
  nftAddress: string;
  tokenId: number;
  price: string;
};
type FormSchema = {
  price: string;
};

const UpdatePriceModal = ({ nftAddress, price: oldPrice, tokenId }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormSchema>({
    defaultValues: {
      price: oldPrice,
    },
  });
  const { closeModal } = useModal();
  const contract = useContract(nftAddress);
  async function onSubmit(values: FormSchema) {
    if (values.price.toString() === oldPrice.toString()) {
      setError("price", {
        type: "manual",
        message: "Price should not be same as old price",
      });
      return;
    }
    toast.promise(
      new Promise(async (res, rej) => {
        const flg = await contract.updatePrice(
          tokenId,
          values.price.toString()
        );
        if (flg) {
          res("Price updated successfully");
          closeModal();
        } else {
          rej("Failed to update price");
        }
      }),
      {
        loading: "Updating price...",
        success: "Price updated successfully",
        error: "Failed to update price",
      }
    );
  }
  return (
    <Modal
      type={`update-price-${nftAddress}${tokenId}`}
      className="w-[350px] p-4"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 px-2">
        <h1 className="text-3xl font-bold mt-8">Update price of NFT</h1>
        <TextField<FormSchema>
          label="Price"
          name="price"
          register={register}
          errorMessage="Price should not be same as old price and should be greater than 0"
          isInvalid={!!errors.price}
          required
          type="text"
        />
        <button className="btn btn-outline" type="submit">
          Save
        </button>
      </form>
    </Modal>
  );
};

export default UpdatePriceModal;
