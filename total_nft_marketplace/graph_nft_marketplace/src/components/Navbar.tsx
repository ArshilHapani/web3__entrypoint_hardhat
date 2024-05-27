import Link from "next/link";
import ConnectButton from "./ConnectButton";

export default function Navbar() {
    return (
        <div>
            <div className="navbar bg-base-100 shadow-md border-b">
                <div className="flex-1">
                    <div className="flex items-center" >
                        <Link href="." className="btn btn-ghost text-xl mr-3">
                            NFT MarketPlace
                        </Link>
                        <div className="flex border-l pl-4 items-center gap-4" >
                            <Link  className="btn btn-link text-gray-500" href="/">
                                Buy NFT
                            </Link>
                            <Link className="btn btn-link text-gray-500"  href="/sell-nft" >
                                Sell NFT
                            </Link>
                            <Link  className="btn btn-link text-gray-500" href="/myNft" >
                                My NFT's
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex-none">
                    <ConnectButton />
                </div>
            </div>
        </div>
    )
}