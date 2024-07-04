require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');
const db = require('./firebase');
const firebaseAdmin = require('firebase-admin');

const app = express();
const token = process.env.TOKEN ;
const bot = new Telegraf(token);

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

  if (startPayload.startsWith('ref_')) {
    const refUserId = startPayload.split('_')[1];
    if (refUserId) {
      await storeReferral(refUserId, userId);
    } else {
      console.error('Invalid refUserId:', refUserId);
    }
  }
});

bot.command('referral', async (ctx) => {
  const referralCode = Math.random().toString(36).substring(7);
  const userId = ctx.from.id;

  try {
    const referralDoc = await db.collection('referrals').doc(referralCode).get();
    if (!referralDoc.exists) {
      await db.collection('referrals').doc(referralCode).set({
        refUserId: userId,
        newUserIds: [],
        referralCount: 0,
        totalBalance: 0,
        referralEarnings: 0
      });
      ctx.reply(`Your referral code is: ${referralCode}`);
    } else {
      ctx.reply('A referral code with this ID already exists. Please try again.');
    }
  } catch (error) {
    console.error('Error writing document: ', error);
    ctx.reply('There was an error generating your referral code. Please try again.');
  }
});

const storeReferral = async (refUserId, newUserId) => {
  if (!refUserId || !newUserId) {
    console.error('Invalid refUserId or newUserId:', { refUserId, newUserId });
    return;
  }

  try {
    // Ensure new user exists in the users collection
    const newUserDocRef = db.collection('users').doc(newUserId.toString());
    const newUserDoc = await newUserDocRef.get();

    if (!newUserDoc.exists) {
      // Create a new user document if it doesn't exist
      await newUserDocRef.set({ totalBalance: 0 });
      console.log('New user created:', newUserId);
    }

    const newUserData = (await newUserDocRef.get()).data();
    const newUserTotalBalance = newUserData.totalBalance;

    // Fetch the referral document
    const referralDocRef = db.collection('referrals').doc(refUserId.toString());
    const referralDoc = await referralDocRef.get();
    if (referralDoc.exists) {
      const userData= referralDoc.data();
      
      // Check if newUserId already exists in the newUserIds array
      if (!referralData.newUserIds.includes(newUserId)) {
        referralData.newUserIds.push(newUserId);
        referralData.referralCount += 1;
        referralData.referralEarnings += 0.1 * newUserTotalBalance;
        referralData.totalBalance += 0.1 * newUserTotalBalance; // Assuming 10% of newUserTotalBalance as referral earnings

        await referralDocRef.update(referralData);
        console.log('Referral stored successfully');
      } else {
        console.log('New user ID already exists in the referral list');
      }
    } else {
      await referralDocRef.set({
        refUserId,
        newUserIds: [newUserId],
        referralCount: 1,
        totalBalance: 0.1 * newUserTotalBalance, // Assuming 10% of newUserTotalBalance as referral earnings
        referralEarnings: 0.1 * newUserTotalBalance
      });
      console.log('Referral stored successfully');
    }
  } catch (error) {
    console.error('Error storing referral: ', error);
  }
};

// Launch the bot
bot.launch();

// Express server setup
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = bot;
