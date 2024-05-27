import { Link } from "react-router-dom";
import { ConnectButton } from "web3uikit";

const Header = () => {
  return (
    <nav className="flex items-center justify-between border-b">
      <div className="flex gap-6 items-center">
        <h1 className="py-4 px-4 font-bold text-3xl">NFT</h1>
        <Link className="hover:underline transition-all duration-200" to="/">
          Home{" "}
        </Link>
        <Link
          className="hover:underline transition-all duration-200"
          to="/sellNFT"
        >
          Sell NFT
        </Link>
      </div>
      <ConnectButton moralisAuth={false} />
    </nav>
  );
};

export default Header;
