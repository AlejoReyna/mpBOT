## mpBot : DeFI en un chatbot 

# Índice de mpBot: DeFi en un chatbot

   


Link para probar nuestro producto: https://t.me/PoolitoAssistantBot
![poolito](https://github.com/user-attachments/assets/e1d779a0-e5e2-47c5-8398-ce6d91a6145c)

## Diagrama de flujo del sistema
<p align="center">
  <img width="863" alt="Screenshot 2024-09-13 at 2 04 19 a m" src="https://github.com/user-attachments/assets/bb6aa8ec-0e1b-43ab-b3fc-bc3e5c013b4c">
</p>
<p align="center">
  <img width="787" alt="Screenshot 2024-09-13 at 2 28 16 a m" src="https://github.com/user-attachments/assets/0648cf3c-15bd-4602-b1cd-f8d52f6b4274">
</p>
<p align="center">
  <img width="562" alt="Screenshot 2024-09-13 at 2 36 59 a m" src="https://github.com/user-attachments/assets/6b769f33-1844-48dc-8296-cd882f236d67">
</p>
<p align="center">
  <img width="633" alt="Screenshot 2024-09-13 at 2 43 00 a m" src="https://github.com/user-attachments/assets/388db22a-39b1-4229-807f-ed89d336d3c8">
</p>

## Documentación del código:

(Basándonos en el path: DefiBotBackend/app/api/telegram; ya que es el que contiene la funcionalidad, el directorio Web fue la versión inicial del proyecto)

## Definición del Bot
Este proyecto implementa un bot de Telegram utilizando el framework Next.js y la biblioteca Telegraf. El bot está diseñado para proporcionar recomendaciones de inversión y información sobre Meta Pool, un servicio de staking. También integra la API de OpenAI para responder preguntas generales sobre DeFi.
```typescript
const bot = new Telegraf(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string);

interface SessionData {
  lang?: string;
}
```

Esta línea está creando una nueva instancia del bot de Telegram utilizando la biblioteca Telegraf.

`new Telegraf()` crea una nueva instancia del bot.
`process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN `accede a una variable de entorno. En este caso, está obteniendo el token del bot de Telegram de las variables de entorno del sistema.
as string es una aserción de tipo en TypeScript, que le dice al compilador que trate este valor como una cadena de texto.

El token del bot es una cadena única proporcionada por Telegram cuando creas un nuevo bot. Es esencial para autenticar y autorizar las acciones del bot en la plataforma de Telegram.

`interface SessionData { lang?: string; }`
Esta parte define una interfaz en TypeScript llamada SessionData. En programación, una interfaz es una estructura que define un contrato en tu código. Define la forma de un objeto, especificando los nombres y tipos de propiedades que debe tener.
Desglosemos esta interfaz:

`interface SessionData` declara una nueva interfaz llamada SessionData.
`{ lang?: string; }` define la estructura de esta interfaz:

lang es el nombre de una propiedad.
? después de lang significa que esta propiedad es opcional.
: string indica que cuando esta propiedad está presente, su valor debe ser una cadena de texto.



En este contexto, SessionData se está utilizando para tipar los datos de sesión del bot. Está diciendo que cada sesión de usuario puede tener una propiedad lang opcional que, si está presente, será una cadena que probablemente represente el idioma preferido del usuario.

## Configuración del middleware de sesión:
   
```typescript
bot.use(session({
  defaultSession: (): SessionData => ({})
}));
```
Esta parte configura el middleware de sesión para el bot de Telegram. 

- `bot.use()` es un método que añade middleware al bot. El middleware es código que se ejecuta entre la recepción de un mensaje y su procesamiento final.
- `session()` es una función que crea un middleware de sesión. Las sesiones permiten al bot mantener datos específicos para cada usuario a lo largo del tiempo.
- `defaultSession: (): SessionData => ({})` es una función que define la sesión por defecto:

Retorna un objeto vacío {} que cumple con la interfaz SessionData.
Esto significa que cada nueva sesión comenzará con un objeto vacío, que puede luego poblarse con datos como el idioma preferido del usuario.

## Configuración de OpenAI 

```typescript
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
```

Esta parte inicializa la API de OpenAI para su uso en el bot. 

new OpenAI() crea una nueva instancia del cliente de OpenAI.
El objeto pasado como argumento contiene la configuración para este cliente:

`apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY` establece la clave API para OpenAI.
`process.env.NEXT_PUBLIC_OPENAI_API_KEY` accede a la clave API almacenada en las variables de entorno del sistema.

Esta configuración permite al bot interactuar con la API de OpenAI, lo cual se utiliza más adelante en el código para generar respuestas a preguntas de los usuarios sobre DeFi en Metapool.

## Configuración de mensajes 

```typescript
const messages = {
  en: { ... },  // Mensajes en inglés
  es: { ... }   // Mensajes en español
};
```
Este código define un objeto messages que contiene todos los mensajes utilizados por el bot Poolito en múltiples idiomas. Esta estructura permite una fácil internacionalización y mantenimiento de los textos del bot.

### Contenido
Cada idioma incluye los siguientes mensajes:

- `welcome`: Mensaje de bienvenida
- `investment_recommendations`: Etiqueta para recomendaciones de inversión
- `market_analysis`: Etiqueta para análisis de mercado
- `portfolio_management`: Etiqueta para gestión de cartera
- `metapool_info`: Etiqueta para información sobre Meta Pool
- `stake_metapool`: Etiqueta para stake con Meta Pool
- `metapool_resources`: Mensaje para recursos de Meta Pool
- `portfolio_link`: Enlace a la aplicación web de gestión de cartera
- `language_selection`: Mensaje para selección de idioma
- `english`: Etiqueta para el idioma inglés
- `spanish`: Etiqueta para el idioma español

```typescript
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
```
- `bot.start()` define un manejador para el comando /start.
- `(ctx) => { ... }` es una función de flecha que se ejecutará cuando se reciba el comando /start. ctx es el contexto de la conversación, que contiene información sobre el mensaje y métodos para responder.
- `ctx.reply()` envía una respuesta al usuario.
- `messages.es.language_selection` es el texto de la respuesta, que pide al usuario que seleccione un idioma.
- El objeto reply_markup define un teclado en línea (inline keyboard) con dos botones:
 Un botón para español con el texto messages.en.spanish y datos de callback 'lang_es'.
 Un botón para inglés con el texto messages.en.english y datos de callback 'lang_en'

## Manejador de Selección de Idioma y Preparación de Bienvenida

```typescript
bot.on('callback_query', async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  //const userId = ctx.from.id;
  console.log(callbackData);

  if (callbackData === 'lang_en' || callbackData === 'lang_es') {
    const lang = callbackData === 'lang_en' ? 'en' : 'es';
    ctx.session.lang = lang; // Store the selected language in session

    // Base URL from environment variable
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    // Array of image paths
    const imagePaths = [
      '/images/PoolitoBot.png',
      '/images/PoolitoBot.png',
    ];

    // ... (código adicional para manejar las imágenes)
  }
});
```

- `bot.on('callback_query', async (ctx) => { ... })` configura un manejador asíncrono para todas las consultas de devolución de llamada (callback queries).
- `const callbackData = ctx.callbackQuery.data;` extrae los datos asociados con el botón que el usuario presionó.
- `console.log(callbackData);` imprime los datos de callback en la consola para depuración.
- `if (callbackData === 'lang_en' || callbackData === 'lang_es')` verifica si el callback es para selección de idioma.
- `const lang = callbackData === 'lang_en' ? 'en' : 'es';` determina el idioma seleccionado.
- `ctx.session.lang = lang;` almacena el idioma seleccionado en la sesión del usuario.
- `const baseUrl = process.env.NEXT_PUBLIC_APP_URL;` obtiene la URL base de una variable de entorno.
- `const imagePaths = [ ... ];` define un array de rutas de imágenes para ser utilizadas posteriormente.

Este código maneja la selección de idioma del usuario, almacena la preferencia y prepara los datos necesarios para enviar una imagen de bienvenida personalizada.


## Generación y Envío de Imagen Aleatoria

```typescript
// Construct full image URLs
const images = imagePaths.map(path => `${baseUrl}${path}`);

// Select a random image
const randomImage = images[Math.floor(Math.random() * images.length)];

// Send the selected image before presenting the main menu
ctx.replyWithPhoto(randomImage, {
  caption: messages[lang].welcome,
  reply_markup: {
    inline_keyboard: [
      [{ text: messages[lang].stake_metapool, callback_data: 'stake_metapool', url: "t.me/PoolitoAssistantBot/PoolitoApp" }],
      [{ text: messages[lang].market_analysis, callback_data: 'market_analysis' }],
      [{ text: messages[lang].portfolio_management, callback_data: 'portfolio_management' }],
      [{ text: messages[lang].metapool_info, callback_data: 'metapool_info' }],
    ],
  },
});
```

Este código genera una URL completa para cada imagen, selecciona una aleatoriamente, y la envía como parte del mensaje de bienvenida junto con un teclado en línea para el menú principal.

## Manejo de Callbacks

### Meta Pool Info
```typescript
if (callbackData === 'metapool_info') {
  const lang = ctx.session.lang || 'es';
  await ctx.reply(messages[lang].metapool_resources);
  await ctx.reply('1. [Meta Pool Official Website](https://www.metapool.app/)\n2. [Meta Pool Documentation](https://docs.metapool.app/master)\n3. [Meta Pool Telegram Group](https://t.me/MetaPoolOfficialGroup)');
}
```

Cuando el usuario selecciona "Meta Pool Info", el bot responde con recursos relacionados con Meta Pool.

### Portfolio Management
```typescript
else if (callbackData === 'portfolio_management') {
  const lang = ctx.session.lang || 'es';
  await ctx.reply(messages[lang].portfolio_link);
}
```

Si el usuario selecciona "Portfolio Management", el bot proporciona un enlace a la herramienta de gestión de cartera.

### Market Analysis
```typescript
else if (callbackData === 'market_analysis') {
  const lang = ctx.session.lang || 'es';
  await ctx.reply(messages[lang].market_analysis);
  await ctx.reply('1. [Meta Pool Official Liquity](https://www.metapool.app/liquidity/)');
}
```

Cuando se selecciona "Market Analysis", el bot responde con información sobre análisis de mercado y proporciona un enlace a la liquidez oficial de Meta Pool.

## Manejo de Mensajes de Texto Genéricos

```typescript
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  const lang = ctx.session.lang || 'es';

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a web3 defi expert." },
        { role: "user", content: `Answer the following question about DeFi: ${userMessage}` },
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
```

Este bloque de código maneja los mensajes de texto genéricos enviados al bot:

1. Captura el mensaje del usuario y el idioma de la sesión.
2. Utiliza la API de OpenAI para generar una respuesta:
   - Usa el modelo "gpt-4o-mini".
   - Define el rol del sistema como un experto en DeFi de web3.
   - Envía la pregunta del usuario sobre DeFi.
3. Registra la respuesta completa de la API en la consola.
4. Extrae el contenido de la respuesta y lo envía al usuario.
5. En caso de error, registra el error y envía un mensaje de disculpa al usuario.

## Manejo del Webhook de Telegram

```typescript
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
```

Esta función `POST` maneja las actualizaciones entrantes del webhook de Telegram:

1. Intenta analizar el cuerpo de la solicitud JSON entrante.
2. Pasa la actualización al método `handleUpdate` de Telegraf para su procesamiento.
3. Si todo es exitoso, devuelve una respuesta "OK" con un estado 200.
4. En caso de error, registra el error y devuelve una respuesta de "Error" con un estado 500.


# Landing page

## Descripción General

Este componente React implementa la página principal de la aplicación. Incluye funcionalidades de conexión de wallet, visualización de balance, depósito de ETH y visualización del historial de transacciones.

##  Importaciones y Configuración

```typescript
'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
// ... (otras importaciones)
import { fetchTransactions } from '@/utils/fetchTransactions';

export const contract = getContract({ 
  client, 
  chain: defineChain(11155111), 
  address: "0xdB59Dc61a6387502D00AA2DAe826e3B6836407EB"
});
```

- Utiliza el modo 'client' de Next.js.
- Importa componentes de UI personalizados y de terceros.
- Define el contrato de Poolito en la red Sepolia.

## Componente Principal: LandingComponent

```typescript
export default function LandingComponent() {
  // ... (estados y lógica del componente)
}
```

### Estados Principales

```typescript
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [transactions, setTransactions] = useState([]);
const account = useActiveAccount();
// ... (otros estados)
```

### Efectos y Funciones Principales

1. Carga de Transacciones
   ```typescript
   useEffect(() => {
     if (account?.address) {
       console.log("Fetching transactions for", account.address);
       fetchTransactions(account.address, contract.address).then(setTransactions);
     }
   }, [account]);
   ```

2. Manejo de Depósitos
   ```typescript
   const handleDeposit = async () => {
     // ... (lógica de depósito)
   };
   ```

3. Actualización de Transacciones
   ```typescript
   const refreshTransactions = async () => {
     // ... (lógica de actualización)
   };
   ```

### Estructura del Render

1. Botón de Conexión
   ```typescript
   <ConnectButton
     client={client}
     chain={defineChain(sepolia)}
     // ... (otras props)
   />
   ```

2. Sección de Bienvenida
   ```typescript
   <section className="w-full py-3 sm:py-3 md:py-6 lg:py-8 xl:py-12">
     {/* ... */}
   </section>
   ```

3. Contenido Principal (cuando está logueado)
   ```typescript
   {isLoggedIn && (
     <section className="w-full py-3 md:py-6 lg:py-8">
       {/* ... */}
     </section>
   )}
   ```

   - Muestra el balance de Meta Pool
   - Permite realizar depósitos
   - Muestra el historial de transacciones

### Componentes Modales

1. Diálogo de Depósito
   ```typescript
   <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
     {/* ... */}
   </Dialog>
   ```

### Tabla de Transacciones

```typescript
<Table>
  <TableHeader>
    {/* ... */}
  </TableHeader>
  <TableBody>
    {transactions.map((tx) => (
      <TableRow key={tx.hash}>
        {/* ... */}
      </TableRow>
    ))}
  </TableBody>
</Table>
```
