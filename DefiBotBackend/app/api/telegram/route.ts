import { NextRequest, NextResponse } from 'next/server';
import { Telegraf } from 'telegraf'; // Or your preferred Telegram bot library

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const bot = new Telegraf(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string);

// Handle '/start' command (initial interaction)
bot.start((ctx) => {

  // Base URL from environment variable
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  // Array of image paths
  const imagePaths = [
    '/images/Invest01.png',
    '/images/Invest02.png',
    '/images/Invest03.png',
    '/images/Invest04.png'
  ];

  // Construct full image URLs
  const images = imagePaths.map(path => `${baseUrl}${path}`);

  // Select a random image
  const randomImage = images[Math.floor(Math.random() * images.length)];

  // Send the selected image before presenting the main menu
  ctx.replyWithPhoto(randomImage, {
    caption: 'Welcome to DefiBot! I can help you with investment recommendations. Please select an option:',
    reply_markup: {
        inline_keyboard: [
          [{ text: 'Investment Recommendations', callback_data: 'investment_recommendations' }],
          [{ text: 'Market Analysis', callback_data: 'market_analysis' }],
          [{ text: 'Portfolio Management', callback_data: 'portfolio_management' }],
          [{ text: 'Learn About Meta Pool Investment', callback_data: 'metapool_info' }],
          [{ text: 'Stake with Meta Pool', callback_data: 'stake_metapool' }],
        ],
      },
    });

});

// Handle callback queries
bot.on('callback_query', async (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  if (callbackData === 'metapool_info') {
    await ctx.reply('Here are some resources to learn about Metapool Investment:');
    await ctx.reply('1. [Metapool Official Website](https://example.com)\n2. [Metapool Whitepaper](https://example.com/whitepaper)\n3. [Metapool Investment Guide](https://example.com/guide)');
  }

  // ... (Handle other callback queries)
});

// Handle other commands or messages
// ... (Implement logic to process user input, generate recommendations, etc.)

export async function POST(request: NextRequest) {
  try {
    // Parse incoming webhook request from Telegram
    const body = await request.json();

    // Pass the update to Telegraf for processing
    await bot.handleUpdate(body);

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error handling Telegram webhook:', error);
    return new NextResponse('Error', { status: 500 });
  }
}