# 💌 Telegram Love Message Bot

A **TypeScript-based Telegram bot** that sends daily **love messages** to your girlfriend 💖.  
Built with **Telegraf**, **Firebase Firestore**, and **Cloud Functions** (2nd Gen).  
Supports **scheduling** and **message management**

---

## 🎯 Features

✅ **Send a love message every day at a set time**  
✅ **Store love messages in Firebase Firestore**  
✅ **Avoid repeating already sent messages**
✅ **Add new message (`/addlove [message]`)**  
✅ **Get random message (`/sendlove`)**  
✅ **Fully deployable to Firebase Cloud Functions**

---

## 🚀 **Setup & Installation**

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/yourusername/love-message-bot.git
cd love-message-bot
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Set Up Environment Variables**
Create a .env file in the `./functions` directory and add:

```sh
BOT_TOKEN=your_telegram_bot_token
GIRLFRIEND_CHAT_ID=your_girlfriend_chat_id

FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```


🏗 **Project Structure**
```
📂 love-message-bot
┣ 📂 src
┃ ┣ 📜 index.ts            # Main bot logic
┃ ┣ 📂 src
┃ ┣   📜 firestore.ts      # Firestore utils
┃ ┣   📜 db.ts             # Connection to Firestore DB
┃ ┣   📜 telegram.ts       # Connection to Telegram API
┣ 📜 .env                  # Environment variables
┣ 📜 package.json          # Dependencies
┣ 📜 README.md             # Project documentation
┗ 📜 firebase.json         # Firebase deployment config
```
