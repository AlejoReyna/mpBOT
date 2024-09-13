# mpBot : DeFI en un chatbot 

## Documentación del código:
(Basándonos en el path: DefiBotBackend/app/api/telegram)

## 1. Definición del Bot
Este código implementa un bot de Telegram utilizando el framework Next.js y la biblioteca Telegraf. El bot está diseñado para proporcionar recomendaciones de inversión y información sobre Meta Pool, un servicio de staking. También integra la API de OpenAI para responder preguntas generales sobre DeFi.
```typescript
const bot = new Telegraf(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string);

interface SessionData {
  lang?: string;
}
```

Esta línea está creando una nueva instancia del bot de Telegram utilizando la biblioteca Telegraf.

new Telegraf() crea una nueva instancia del bot.
process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN accede a una variable de entorno. En este caso, está obteniendo el token del bot de Telegram de las variables de entorno del sistema.
as string es una aserción de tipo en TypeScript, que le dice al compilador que trate este valor como una cadena de texto.

El token del bot es una cadena única proporcionada por Telegram cuando creas un nuevo bot. Es esencial para autenticar y autorizar las acciones del bot en la plataforma de Telegram.

interface SessionData { lang?: string; }
Esta parte define una interfaz en TypeScript llamada SessionData. En programación, una interfaz es una estructura que define un contrato en tu código. Define la forma de un objeto, especificando los nombres y tipos de propiedades que debe tener.
Desglosemos esta interfaz:

interface SessionData declara una nueva interfaz llamada SessionData.
{ lang?: string; } define la estructura de esta interfaz:

lang es el nombre de una propiedad.
? después de lang significa que esta propiedad es opcional.
: string indica que cuando esta propiedad está presente, su valor debe ser una cadena de texto.



En este contexto, SessionData se está utilizando para tipar los datos de sesión del bot. Está diciendo que cada sesión de usuario puede tener una propiedad lang opcional que, si está presente, será una cadena que probablemente represente el idioma preferido del usuario.

## 2. Configuración del middleware de sesión:
   
```typescript
bot.use(session({
  defaultSession: (): SessionData => ({})
}));
```
Esta parte configura el middleware de sesión para el bot de Telegram. 

- bot.use() es un método que añade middleware al bot. El middleware es código que se ejecuta entre la recepción de un mensaje y su procesamiento final.
- session() es una función que crea un middleware de sesión. Las sesiones permiten al bot mantener datos específicos para cada usuario a lo largo del tiempo.
- defaultSession: (): SessionData => ({}) es una función que define la sesión por defecto:

Retorna un objeto vacío {} que cumple con la interfaz SessionData.
Esto significa que cada nueva sesión comenzará con un objeto vacío, que puede luego poblarse con datos como el idioma preferido del usuario.

## 3. Configuración de OpenAI 

```typescript
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
```

Esta parte inicializa la API de OpenAI para su uso en el bot. 

new OpenAI() crea una nueva instancia del cliente de OpenAI.
El objeto pasado como argumento contiene la configuración para este cliente:

apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY establece la clave API para OpenAI.
process.env.NEXT_PUBLIC_OPENAI_API_KEY accede a la clave API almacenada en las variables de entorno del sistema.

Esta configuración permite al bot interactuar con la API de OpenAI, lo cual se utiliza más adelante en el código para generar respuestas a preguntas de los usuarios sobre DeFi en Metapool.

## 4. Configuración de mensajes 

```typescript
const messages = {
  en: { ... },  // Mensajes en inglés
  es: { ... }   // Mensajes en español
};
```
Este código define un objeto messages que contiene todos los mensajes utilizados por el bot Poolito en múltiples idiomas. Esta estructura permite una fácil internacionalización y mantenimiento de los textos del bot.

### Contenido
Cada idioma incluye los siguientes mensajes:

- welcome: Mensaje de bienvenida
- investment_recommendations: Etiqueta para recomendaciones de inversión
- market_analysis: Etiqueta para análisis de mercado
- portfolio_management: Etiqueta para gestión de cartera
- metapool_info: Etiqueta para información sobre Meta Pool
- stake_metapool: Etiqueta para stake con Meta Pool
- metapool_resources: Mensaje para recursos de Meta Pool
- portfolio_link: Enlace a la aplicación web de gestión de cartera
- language_selection: Mensaje para selección de idioma
- english: Etiqueta para el idioma inglés
- spanish: Etiqueta para el idioma español
