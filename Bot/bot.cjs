require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBoapqfEEJwsZiStOWhZeTZlpFStKFCY80",
    authDomain: "lunar-2ac46.firebaseapp.com",
    databaseURL: "https://lunar-2ac46-default-rtdb.firebaseio.com",
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

    const messageText = `
*Hey, ${userName}\\! Welcome to Lunar\\!*
Tap [here](${urlSent}) and see your balance rise\\.

Bring them all into the game\\.
    `;

    ctx.replyWithMarkdown(messageText, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Start Now", web_app: { url: urlSent } }]
            ]
        },
    });        
});

bot.command('referral', async (ctx) => {
    const referralCode = Math.random().toString(36).substring(7);
    const userId = ctx.from.id;
  
    try {
        await setDoc(doc(db, 'referrals', referralCode), {
            userId: userId,
            createdAt: serverTimestamp(),
        });
        ctx.reply(`Your referral code is: ${referralCode}`);
    } catch (error) {
        console.error('Error writing document: ', error);
        ctx.reply('There was an error generating your referral code. Please try again.');
    }
});

bot.launch();

module.exports = bot;
