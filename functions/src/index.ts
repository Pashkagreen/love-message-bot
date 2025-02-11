import {Context} from "telegraf";
import {
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import {onRequest} from "firebase-functions/v2/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import dotenv from "dotenv";
import {message} from "telegraf/filters";
import {db, messagesCollection} from "./utils/db";
import {bot, CHAT_ID} from "./utils/telegram";

/**
 * Load envs
 */
dotenv.config();

bot.command("addlove", async (ctx: Context) => {
  if (ctx.has(message("text"))) {
    const messageText = ctx.message.text.replace("/addlove", "").trim();

    if (!messageText) {
      await ctx.reply("Please provide a love message after /addlove");
      return;
    }

    try {
      await addDoc(messagesCollection, {text: messageText, sent: false});
      await ctx.reply("Love message added! ❤️");
    } catch (error) {
      console.error("Error adding document:", error);
      await ctx.reply("Failed to save the love message. 😢");
    }
  }
});

bot.command("sendlove", async () => {
  console.log("Sending random love message...");
  await sendLoveMessage();
});

bot.command("getchatid", async (ctx) => {
  const chatId = ctx.chat?.id;
  if (chatId) {
    await ctx.reply(`Your Chat ID is: \`${chatId}\``, {parse_mode: "Markdown"});
    console.log(`Chat ID: ${chatId}`);
  } else {
    await ctx.reply("Couldn't fetch the chat ID. Try again.");
  }
});

/**
 * Send random love message
 */
async function sendLoveMessage() {
  try {
    const querySnapshot = await getDocs(messagesCollection);
    const messages = querySnapshot.docs
      .filter((doc) => !doc.data().sent)
      .map((doc) => ({id: doc.id, text: doc.data().text}));

    if (messages.length === 0) {
      console.log("No new love messages left! Resetting all messages... ❤️");

      // eslint-disable-next-line max-len
      await bot.telegram.sendMessage(CHAT_ID, "No new love messages left! Resetting all messages... Please, try again... ❤️");
      await resetMessages();
      return;
    }

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    await bot.telegram.sendMessage(CHAT_ID, randomMessage.text);
    console.log(`Sent love message: ${randomMessage.text}`);

    const messageDocRef = doc(db, "loveMessages", randomMessage.id);
    await updateDoc(messageDocRef, {sent: true});
  } catch (error) {
    console.error("Error sending love message:", error);
  }
}

/**
 * Reset already sent messages status and include them into dataset
 */
async function resetMessages() {
  try {
    const querySnapshot = await getDocs(messagesCollection);
    for (const docSnapshot of querySnapshot.docs) {
      const messageDocRef = doc(db, "loveMessages", docSnapshot.id);
      await updateDoc(messageDocRef, {sent: false});
    }
    console.log("All messages have been reset to unsent.");
  } catch (error) {
    console.error("Error resetting messages:", error);
  }
}

/**
 * Sends love message daily at 19:00 UTC+0
 */
export const scheduledLoveMessage = onSchedule(
  {schedule: "0 19 * * *", timeZone: "UTC"},
  async () => {
    console.log("Sending daily love message...");
    await sendLoveMessage();
  }
);

/**
 * Listen to webhook events from Telegram bot
 */
export const botWebhook = onRequest(async (req, res) => {
  await bot.handleUpdate(req.body);
  res.status(200).send("OK");
});

console.log("Love Message Bot deployed to Firebase Cloud Functions (2nd Gen).");
