import React, { useState, useEffect } from 'react';
import { createThirdwebClient, getContract, resolveMethod } from "thirdweb";
import { ThirdwebProvider } from "thirdweb/react";
import { useReadContract } from "thirdweb/react";
import { client } from "@/providers/ThirdwebProvider";
import { sepolia, defineChain } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import { fromGwei } from "thirdweb/utils";
import { toEther } from "thirdweb/utils";

export const contract = getContract({ 
    client, 
    chain: defineChain(11155111), 
    address: "0xdB59Dc61a6387502D00AA2DAe826e3B6836407EB"
  });

export default function UserBalance() {
    const account = useActiveAccount();
    const [balance, setBalance] = useState("0");

    const { data, isLoading } = useReadContract({ 
        contract, 
        method: "function balanceOf(address account) view returns (uint256)", 
        params: [account?.address || "0x0"] 
      });

    useEffect(() => {
        if (data) {
            setBalance(toEther(data).toString());
        }
    }, [data]);

    return (
             <span className="text-2xl font-bold">{balance} ETH</span>
    )
}
