import { NextRequest, NextResponse } from 'next/server';
import { Telegraf } from 'telegraf'; // Or your preferred Telegram bot library

import OpenAI from "openai";

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const bot = new Telegraf(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string);

// OpenAI setup
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

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
  } else if (callbackData === 'portfolio_management') {
    await ctx.reply('Please use the following link to access the Portfolio Management web app: [Portfolio Management](https://t.me/DefiMxBot/DefiFrutas)');
  }

  // ... (Handle other callback queries)
});

// Handle generic text messages
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;

  try {

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a web3 defi expert." },
            {
                role: "user",
                content: `Answer the following question about DeFi: ${userMessage}`,
            },
        ],        
    });

    console.log(response);

    // const response = await openai.createCompletion({
    //   model: 'text-davinci-003',
    //   prompt: `Answer the following question about DeFi: ${userMessage}`,
    //   max_tokens: 150,
    // });

    const answer = response.choices[0].message?.content ?? '';
    await ctx.reply(answer);
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    await ctx.reply('Sorry, I am having trouble answering your question right now.');
  }
});

// Handle other commands or messages
// ... (Implement logic to process user input, generate recommendations, etc.)
// Handle messages (integrate OpenAI)

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