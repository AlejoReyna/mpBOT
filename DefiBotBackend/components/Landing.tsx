'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { ConnectButton } from "thirdweb/react";
import { sepolia, defineChain } from "thirdweb/chains";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";

import { client, wallets } from "@/providers/ThirdwebProvider";
import UserBalance from "@/components/UserBalance";

import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

import { fromGwei } from "thirdweb/utils";
import { toEther } from "thirdweb/utils";

// Mock data for demonstration
const mockTransactions = [
  { id: 1, type: 'deposit', amount: '0.5', date: '2023-06-01' },
  { id: 2, type: 'deposit', amount: '0.25', date: '2023-06-05' },
  { id: 3, type: 'withdrawal', amount: '0.1', date: '2023-06-10' },
]

export default function LandingComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const account = useActiveAccount();

  const processLogin = async () => {
    setIsLoggedIn(true);
  }
  const processLogout = async () => {
    setIsLoggedIn(false);
  }


  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [amount, setAmount] = useState('0')

  const handleDeposit = () => {
    // Here you would handle the actual deposit logic
    console.log(`Depositing ${amount} ETH to ${account?.address}`)
    setIsDepositOpen(false)
    setAmount('0')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">

        <section className="w-full py-6 md:py-6 lg:py-8">
          <div className="container px-4 md:px-6 flex justify-center items-center">
            <ConnectButton
              client={client}
              chain={defineChain(sepolia)}
              chains={[sepolia]}
              wallets={wallets}
              connectModal={{ size: "compact" }}
              onConnect={processLogin}
              onDisconnect={processLogout}
            />
          </div>
        </section>

        <section className="w-full py-3 sm:py-3 md:py-6 lg:py-8 xl:py-12">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-center">
              Poolito Bot
            </h1>
            <h3 className="text-2xl font-bold tracking-tighter sm:text-2xl md:text-2xl lg:text-3xl/none text-center">
              Meta Pool Assistant
            </h3>
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

        {isLoggedIn && (

          <section className="w-full py-3 md:py-6 lg:py-8">
            <div className="container px-4 md:px-6 flex justify-center items-center">

              <div className="container mx-auto p-4">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Meta Pool Balance</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Wallet className="mr-2" />
                      <UserBalance />
                    </div>
                    <Button onClick={() => setIsDepositOpen(true)}>Deposit</Button>
                  </CardContent>
                </Card>

                <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen} >
                  <DialogContent className="bg-white text-black">
                    <DialogHeader>
                      <DialogTitle>Deposit ETH</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-6 items-center gap-4">
                        <label htmlFor="amount" className="text-right">
                          Amount
                        </label>
                        <Input
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="col-span-5"
                          placeholder="Enter ETH amount"
                        />
                      </div>
                      <div className="grid grid-cols-6 items-center gap-4">
                        <label htmlFor="address" className="text-right">
                          Address
                        </label>
                        <Input
                          id="address"
                          value={account?.address}
                          readOnly
                          className="col-span-5"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDepositOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleDeposit}>Send</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount (ETH)</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockTransactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>
                              {tx.type === 'deposit' ? (
                                <ArrowDownLeft className="text-green-500 inline mr-2" />
                              ) : (
                                <ArrowUpRight className="text-red-500 inline mr-2" />
                              )}
                              {tx.type}
                            </TableCell>
                            <TableCell>{tx.amount}</TableCell>
                            <TableCell>{tx.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

            </div>
          </section>
        )}
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