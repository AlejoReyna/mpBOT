"use client";
import React, { useState, useCallback } from 'react';
import { ethers } from 'ethers';

const MetamaskConnection = () => {
    const [address, setAddress] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const connectWallet = useCallback(async () => {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask!');
            return;
        }

        setIsLoading(true);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setAddress(address);
            setIsConnected(true);
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            alert('Failed to connect wallet. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const sendMessageToTelegram = useCallback(async () => {
        if (!isConnected) {
            alert('Please connect your wallet first!');
            return;
        }

        setIsLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const message = "I authorize the connection to LendBot";
            const signature = await signer.signMessage(message);

            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address, signature }),
            });

            const data = await response.json();
            if (data.success) {
                alert('Message sent to Telegram successfully!');
            } else {
                throw new Error(data.error || 'Failed to send message to Telegram');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [isConnected, address]);

    return (
        <div>
            {!isConnected ? (
                <button onClick={connectWallet} disabled={isLoading}>
                    {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>
            ) : (
                <>
                    <p>Connected: {address}</p>
                    <button onClick={sendMessageToTelegram} disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Message to Telegram'}
                    </button>
                </>
            )}
        </div>
    );
};

export default MetamaskConnection;