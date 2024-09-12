"use client";

import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { sepolia, defineChain } from "thirdweb/chains";

import {
  inAppWallet,
  createWallet,
} from "thirdweb/wallets";

export const client = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "" });

const wallets = [
  inAppWallet({
    auth: {
      options: ["telegram", "google", "email", "phone"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.binance"),
];

export default function Home() {
  // Check if window.TelegramGameProxy is available
  if (typeof window !== "undefined" && window.TelegramGameProxy) {
    // Your logic here
  } else {
    console.warn("TelegramGameProxy is not available.");
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Welcome to Meta Pool Investment Bot</h1>
      <ConnectButton 
        client={client}
        chain={defineChain(sepolia)} 
        chains={[ sepolia]}
        wallets={wallets}
        connectModal={{ size: "compact" }}        
      />
    </div>
  );
}
