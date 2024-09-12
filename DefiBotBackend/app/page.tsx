"use client";

import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";


export const client = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "" });


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
      <ConnectButton client={client} />
    </div>
  );
}
