'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { sepolia, defineChain } from "thirdweb/chains";
import {
    inAppWallet,
    createWallet,
  } from "thirdweb/wallets";
  import { useActiveAccount, useWalletBalance } from "thirdweb/react";

  export const client = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "" });

  const wallets = [
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
    
export default function LandingComponent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const account = useActiveAccount();
    
    const processLogin = async () => {
        setIsLoggedIn(true);
    }
    const processLogout = async () => {
        setIsLoggedIn(false);
    }
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-center">
              Welcome to Poolito
            </h1>
            <p className="mt-4 text-gray-500 md:text-xl dark:text-gray-400 text-center">
              Your one-stop solution for all your meta Pool Stake needs. Dive into efficiency!
            </p>
          </div>
        </section>

        {!isLoggedIn && (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 flex justify-center items-center">
            <Image
              src="/images/PoolitoBanner.png?height=400&width=800"
              width={800}
              height={400}
              alt="Poolito Banner"
              className="rounded-lg object-cover w-full"
            />
          </div>
        </section>
        )}

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 flex justify-center items-center">

          <ConnectButton 
                client={client}
                chain={defineChain(sepolia)} 
                chains={[ sepolia]}
                wallets={wallets}
                connectModal={{ size: "compact" }}
                onConnect={processLogin}
                onDisconnect={processLogout}
            />
            
          </div>
        </section>
      </main>

      <footer className="w-full py-3 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            © 2024 Poolito. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}