"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

import ConnectButton from "./ConnectButton";

const items = [
  {
    label: "Buy NFT",
    href: "/",
  },
  {
    label: "Sell NFT",
    href: "/sell-nft",
  },
  {
    label: "My NFT's",
    href: "/myNft",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <div>
      <div className="navbar bg-base-100 shadow-md border-b">
        <div className="flex-1">
          <div className="flex items-center">
            <Link href="." className={twMerge("btn btn-ghost text-xl mr-3")}>
              NFT MarketPlace
            </Link>
            <div className="flex border-l pl-4 items-center gap-4">
              {items.map((item) => (
                <Link
                  key={item.href}
                  className={twMerge(
                    "btn btn-link text-gray-500 underline-none hover:text-black hover:underline transition-all duration-200",
                    pathname == item.href &&
                      "font-bold text-black underline underline-none"
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-none">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
