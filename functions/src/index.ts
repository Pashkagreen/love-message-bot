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
import {addMessagesToFirestore, resetMessages} from "./utils/firestore";

/**
 * Load envs
 */
dotenv.config();

const cronTime = 21;

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

bot.on("new_chat_members", async (ctx) => {
  const newMembers = ctx.message.new_chat_members;
  const querySnapshot = await getDocs(messagesCollection);
  const dbLength = querySnapshot.docs.length;

  for (const member of newMembers) {
    const welcomeMessage = `Привет, ${member.first_name}! ❤️ Я - виртуальный Паша, который будет говорить тебе милости перед сном! В моей базе находится ${dbLength} сообщений. Я пишу милоту каждый день в ${cronTime}:00 UTC. \nДополнительную милоту можно получить, вызвав команду "/sendlove". \nДо встречи! 😊`;

    try {
      await ctx.reply(welcomeMessage);
      console.log(`Sent welcome message to ${member.first_name}`);
    } catch (error) {
      console.error("Error sending welcome message:", error);
    }
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
      await bot.telegram.sendMessage(CHAT_ID, "Вы получили все возможные комплименты! Идет сброс статистики отправленных сообщений... Пожалуйста, попробуйте еще раз ❤️");
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
 * Method for importing loveMessages as a string[]
 */
export const importLoveMessages = onRequest(async (req, res): Promise<any> => {
  try {
    const {messages} = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({error: "Invalid input. Expected an array of messages."});
    }

    await addMessagesToFirestore(messages);
    res.status(200).json({message: "✅ Messages successfully added to Firestore!"});
  } catch (error) {
    console.error("❌ Error processing request:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

/**
 * Sends love message daily at 21:00 UTC+0
 */
export const scheduledLoveMessage = onSchedule(
  {schedule: `0 ${cronTime} * * *`, timeZone: "UTC"},
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
