"use client";

import { ConnectWallet, MediaRenderer } from "@thirdweb-dev/react";

const ConnectButton = () => {
  return (
    <div>
      <ConnectWallet
        btnTitle="Connect"
        hideReceiveButton
        hideSendButton
        hideBuyButton
        modalTitle="Arshil's DApp"
        modalTitleIconUrl="https://arshil.tech/images/logo.png"
        displayBalanceToken={{ 10: "ETH" }}
        welcomeScreen={{ title: "Arshil", subtitle: "Send Me Some ETH" }}
        auth={{ loginOptional: true }}
      />
    </div>
  );
};

export default ConnectButton;
