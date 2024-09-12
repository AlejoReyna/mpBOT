import { NextRequest, NextResponse } from 'next/server';
import { Telegraf, session } from 'telegraf'; // Import session from telegraf
import { BaseContext } from 'telegraf/typings/context';
import OpenAI from "openai";

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const bot = new Telegraf(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string);

// Define the session data structure
interface SessionData {
  lang?: string;
}

// Add session middleware with default session data
bot.use(session({
  defaultSession: (): SessionData => ({})
}));

// OpenAI setup
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Define messages in JSON objects
const messages = {
  en: {
    welcome: 'Welcome to Poolito Bot! I can help you with investment recommendations. \nPlease select an option:',
    investment_recommendations: 'Investment Recommendations',
    market_analysis: 'Market Analysis',
    portfolio_management: 'Portfolio Management',
    metapool_info: 'Learn About Meta Pool Investment',
    stake_metapool: 'Stake with Meta Pool',
    metapool_resources: 'Here are some resources to learn about Meta Pool Investment:',
    portfolio_link: "Please use the following link to access the Portfolio Management web app: [Portfolio Management](https://www.metapool.app/dashboard/)",
    language_selection: 'Please select your language / Por favor seleccione su idioma:',
    english: 'English',
    spanish: 'Español',
  },
  es: {
    welcome: '¡Bienvenido a Poolito Bot! Puedo ayudarte con recomendaciones de inversión. \nPor favor selecciona una opción:',
    investment_recommendations: 'Recomendaciones de Inversión',
    market_analysis: 'Análisis de Mercado',
    portfolio_management: 'Gestión de Cartera',
    metapool_info: 'Aprender mas sobre Meta Pool',
    stake_metapool: 'Stake con Meta Pool',
    metapool_resources: 'Aquí hay algunos recursos para aprender sobre Meta Pool:',
    portfolio_link: "Por favor usa el siguiente enlace para acceder a la aplicación web de Gestión de Cartera: [Gestión de Cartera](https://www.metapool.app/dashboard/)",
    language_selection: 'Por favor seleccione su idioma / Please select your language:',
    english: 'English',
    spanish: 'Español',
  }
};

// Handle '/start' command (initial interaction)
bot.start((ctx) => {
  
  console.log("** start **");
  console.log(ctx);

  ctx.reply(messages.es.language_selection, {
    reply_markup: {
      inline_keyboard: [
        [{ text: messages.en.spanish, callback_data: 'lang_es' }],
        [{ text: messages.en.english, callback_data: 'lang_en' }],
      ],
    },
  });
});

// Handle callback queries
bot.on('callback_query', async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  //const userId = ctx.from.id;

  console.log("** **");
  // console.log(ctx);
  console.log(callbackData);

  if (callbackData === 'lang_en' || callbackData === 'lang_es') {
    console.log("** 1 **");
    const lang = callbackData === 'lang_en' ? 'en' : 'es';
    console.log(lang);
    console.log("** 1.1 **");
    ctx.session.lang = lang; // Store the selected language in session
    console.log("** 1.2 **");

    // Base URL from environment variable
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    // Array of image paths
    const imagePaths = [
      '/images/PoolitoBot.png',
      '/images/PoolitoBot.png',
    ];

    // Construct full image URLs
    const images = imagePaths.map(path => `${baseUrl}${path}`);

    // Select a random image
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Send the selected image before presenting the main menu

    console.log("** ",messages[lang].welcome);

    ctx.replyWithPhoto(randomImage, {
      caption: messages[lang].welcome,
      reply_markup: {
        inline_keyboard: [
          // [{ text: messages[lang].investment_recommendations, callback_data: 'investment_recommendations'}],
          [{ text: messages[lang].market_analysis, callback_data: 'market_analysis' }],
          [{ text: messages[lang].portfolio_management, callback_data: 'portfolio_management' }],
          [{ text: messages[lang].metapool_info, callback_data: 'metapool_info' }],
          [{ text: messages[lang].stake_metapool, callback_data: 'stake_metapool', url: "t.me/PoolitoAssistantBot/PoolitoApp" }],
        ],
      },
    });
  } else if (callbackData === 'metapool_info') {

    console.log("** 2 **");
    const lang = ctx.session.lang || 'es';    
    await ctx.reply(messages[lang].metapool_resources);
    await ctx.reply('1. [Meta Pool Official Website](https://www.metapool.app/)\n2. [Meta Pool Documentation](https://docs.metapool.app/master)\n3. [Meta Pool Telegram Group](https://t.me/MetaPoolOfficialGroup)');

  } else if (callbackData === 'portfolio_management') {
    console.log("** 3 **");
    const lang = ctx.session.lang || 'es';
    await ctx.reply(messages[lang].portfolio_link);
  } else if (callbackData === 'market_analysis') {
    console.log("** 4 **");
    const lang = ctx.session.lang || 'es';
    await ctx.reply(messages[lang].market_analysis);
    await ctx.reply('1. [Meta Pool Official Liquity](https://www.metapool.app/liquidity/)');
  }

  // ... (Handle other callback queries)
});

// Handle generic text messages
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  const lang = ctx.session.lang || 'es';

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