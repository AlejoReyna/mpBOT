import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const botToken: string = process.env.BOT_TOKEN || '';
const chatId: string = process.env.CHAT_ID || '';

export async function POST(req: NextRequest) {
    try {
        const telegramMessage: string = `Test message from server`;

        console.log('Sending test message to Telegram:', telegramMessage);
        console.log('Bot Token:', botToken.substring(0, 5) + '...');
        console.log('Chat ID:', chatId);

        const telegramResponse = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
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