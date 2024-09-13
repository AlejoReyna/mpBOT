import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const BASE_URL = 'https://api-sepolia.etherscan.io/api';

export async function fetchTransactions(userWallet, contractAddress) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                module: 'account',
                action: 'txlist',
                address: userWallet,
                startblock: 0,
                endblock: 99999999,
                sort: 'desc', // Order by time descending
                apikey: API_KEY
            }
        });

        const transactions = response.data.result;

        // Filter transactions involving the contract address
        const filteredTransactions = transactions.filter(tx => tx.to.toLowerCase() === contractAddress.toLowerCase());

        // Sort transactions by timeStamp in descending order
        return filteredTransactions.sort((a, b) => b.timeStamp - a.timeStamp);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}
