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
          {...register(name as Path<FormSchema>, { required })}
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
