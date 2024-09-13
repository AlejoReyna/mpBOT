import { createThirdwebClient } from "thirdweb";
import {
    inAppWallet,
    createWallet,
  } from "thirdweb/wallets";

  
export const client = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "" });

export const wallets = [
    inAppWallet({
      auth: {
        options: ["telegram", "google", "email", "phone"],
      },
    }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("com.okex.wallet"),
    createWallet("walletConnect"),
    createWallet("io.xdefi"),
    createWallet("com.coin98"),
  ];
