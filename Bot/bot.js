const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://your-database-name.firebaseio.com'
});

const db = admin.firestore();
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;
  const referralParam = match[1].trim();
  let referrerId = null;

  if (referralParam.startsWith('?ref=')) {
    referrerId = referralParam.replace('?ref=', '');
  }

  await db.collection('users').doc(userId.toString()).set({
    telegramUserId: userId,
    telegramUsername: username,
    telegramChatId: chatId,
  }, { merge: true });

  if (referrerId) {
    const referrerDoc = await db.collection('users').doc(referrerId).get();
    if (referrerDoc.exists) {
      await db.collection('referrals').add({ referrerId, telegramUserId: userId });
      bot.sendMessage(chatId, 'You have been referred by ' + referrerDoc.data().telegramUsername);
    } else {
      bot.sendMessage(chatId, 'Invalid referral link.');
    }
  }

  bot.sendMessage(chatId, 'Welcome to the referral program! Use /referral to get your referral code.');
});

bot.onText(/\/referral/, async (msg) => {
  const userId = msg.from.id;
  const user = await db.collection('users').doc(userId.toString()).get();
  if (user.exists) {
    const referralCode = user.data().referralCode;
    bot.sendMessage(msg.chat.id, `Your referral code is: game_botstart?ref=${referralCode}`);
  } else {
    bot.sendMessage(msg.chat.id, 'You need to /start first.');
  }
});

function sendReferralNotification(userId, amount) {
  db.collection('users').doc(userId.toString()).get().then(user => {
    const chatId = user.data().telegramChatId;
    bot.sendMessage(chatId, `You earned ${amount} as a referral reward!`);
  });
}

module.exports = { sendReferralNotification };
