/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect } from "react";

import useWallet from "@/hooks/useWallet";

const Navbar = () => {
  const { connect, address, balance, isConnected, isLoading } = useWallet();

  useEffect(() => {
    if (isConnected && address !== "") return;
    else if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        connect();
      }
    }
  }, [address, connect, isConnected]);

  useEffect(() => {
    setTimeout(() => {
      if (address === "") {
        if (
          typeof window !== "undefined" &&
          window.localStorage.getItem("connected")
        ) {
          window.localStorage.removeItem("connected");
        }
      }
    }, 5000);
  }, [address]);

  return (
    <>
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">
            <img
              src="https://arshil.tech/images/logo.png"
              alt="Logo"
              className="h-12 mr-4"
            />
            Lottery DApp
          </a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              {balance !== 0 && address !== "" ? (
                <div className="text-gray-300">
                  {balance} ETH,{" "}
                  <p className="bg-gray-900 rounded-lg">
                    {address.slice(0, 4)}...{address.slice(-4)}
                  </p>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    await connect();
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem("connected", "injected");
                    }
                  }}
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
