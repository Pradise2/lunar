require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Telegram Bot Token
const TOKEN = process.env.TOKEN;
const bot = new Telegraf(TOKEN);