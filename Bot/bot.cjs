require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');


const firebaseConfig = {
    apiKey: "AIzaSyAURFbyDHkq626UusPHMijpxmcUOOl5-Tw",
    authDomain: "test-f326f.firebaseapp.com",
    databaseURL: "https://test-f326f-default-rtdb.firebaseio.com",
    projectId: "test-f326f",
    storageBucket: "test-f326f.appspot.com",
    messagingSenderId: "626801402709",
    appId: "1:626801402709:web:d3653b964333a0de6845dc",
    measurementId: "G-517PH4LM9K"
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
