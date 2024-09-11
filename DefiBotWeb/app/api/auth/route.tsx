import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const botToken: string = process.env.BOT_TOKEN || '';

async function getLatestMessage() {
    const response = await axios.get(`https://api.telegram.org/bot${botToken}/getUpdates`);
    const updates = response.data.result;
    if (updates.length > 0) {
        const latestUpdate = updates[updates.length - 1];
        return {
            chatId: latestUpdate.message.chat.id,
            text: latestUpdate.message.text
        };
    }
    return null;
}

export async function POST(req: NextRequest) {
    try {
        const { address, signature } = await req.json();

        // Verificar la firma
        const message = "I authorize the connection to LendBot";
        const recoveredAddress = ethers.verifyMessage(message, signature);

        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
        }

        const latestMessage = await getLatestMessage();
        if (!latestMessage) {
            return NextResponse.json({ error: 'No se encontraron mensajes recientes' }, { status: 404 });
        }

        const telegramMessage: string = `Nueva conexión desde la dirección: ${address}`;

        console.log('Sending message to Telegram:', telegramMessage);
        console.log('Bot Token:', botToken.substring(0, 5) + '...');
        console.log('Chat ID:', latestMessage.chatId);

        const telegramResponse = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: latestMessage.chatId,
            text: telegramMessage
        });

        console.log('Telegram API Response:', telegramResponse.data);

        return NextResponse.json({ success: true, telegramResponse: telegramResponse.data });

    } catch (error: any) {
        console.error('Error sending message to Telegram:', error);
        return NextResponse.json({ error: 'Failed to send message to Telegram', details: error.message }, { status: 500 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { status: 405, headers: { Allow: 'POST' } });
}