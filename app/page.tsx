"use client"

import axios from 'axios';

const sendTestMessage = async () => {
    try {
        const response = await axios.post('/api/auth', {}); // Enviar un JSON vacío
        console.log('Response from server:', response.data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

const TestMessage = () => (
    <div>
        <h1>Send a test message to Telegram</h1>
        <button onClick={sendTestMessage}>Send Test Message</button>
    </div>
);

export default TestMessage;