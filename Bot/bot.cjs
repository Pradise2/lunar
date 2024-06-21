require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');


const firebaseConfig = {
    apiKey: "AIzaSyBoapqfEEJwsZiStOWhZeTZlpFStKFCY80",
    databaseURL: "https://lunar-2ac46-default-rtdb.firebaseio.com/",
      authDomain: "lunar-2ac46.firebaseapp.com",
  projectId: "lunar-2ac46",
  storageBucket: "lunar-2ac46.appspot.com",
  messagingSenderId: "954289049346",
  appId: "1:954289049346:web:1a08d54b3ae4122c82fc1b",
  measurementId: "G-57Q2844SHQ"
 
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Telegram Bot Token
const TOKEN = process.env.TOKEN || '7109694153:AAFe_7FE0huybS3EV17KE9taivyTQS11zeI';
const bot = new Telegraf(TOKEN);

// Web App Link
const web_link = 'https://lunar-pi-weld.vercel.app/';

// Start Handler
bot.start(async (ctx) => {
    const startPayload = ctx.startPayload || '';
    const userId = ctx.chat.id;
    const urlSent = `${web_link}?ref=${startPayload}&userId=${userId}`;
    const user = ctx.message.from;
    const userName = user.username ? `@${user.username.replace(/[-.!]/g, '\\$&')}` : user.first_name;
    const isBot = user.is_bot;

    const messageText = `
*Hey, ${userName}\\! Welcome to Lunar\\!*
Tap [here](${urlSent}) and see your balance rise\\.

Bring them all into the game\\.
    `;

    ctx.replyWithMarkdown(messageText, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Start Now", web_app: { url: urlSent } }]
            ],
            in: true
        },
    });        
});



bot.launch();

module.exports = bot;
