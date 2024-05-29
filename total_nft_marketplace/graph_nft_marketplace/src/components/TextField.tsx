"use client";

import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type Props<T extends FieldValues> = {
  label: string;
  register: UseFormRegister<T>;
  name: keyof T;
  errorMessage?: string;
  isInvalid?: boolean;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  type?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "time"
    | "datetime-local";
  isAddress?: boolean;
};

function TextField<FormSchema extends FieldValues>({
  label,
  name,
  register,
  errorMessage,
  isInvalid,
  required,
  placeholder,
  disabled,
  type = "text",
  isAddress,
}: Props<FormSchema>) {
  return (
    <div>
      <label className="form-control w-full">
        <div className="label">
          <span className={twMerge("label-text", isInvalid && "text-error")}>
            {isInvalid ? errorMessage : label}
          </span>
        </div>
        <input
          type={type}
          {...register(name as Path<FormSchema>, {
            required,
            pattern: isAddress ? /^0x[a-fA-F0-9]{40}$/ : undefined,
          })}
          placeholder={placeholder}
          className={twMerge(
            "input input-bordered",
            isInvalid && "input-error"
          )}
          disabled={disabled}
        />
      </label>
    </div>
  );
}

export default TextField;
