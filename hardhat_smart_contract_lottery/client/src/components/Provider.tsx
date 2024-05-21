"use client";

import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
};

const Provider = ({ children }: Props) => {
  return (
    <>
      <Toaster position="bottom-center" />
      {children}
    </>
  );
};

export default Provider;
