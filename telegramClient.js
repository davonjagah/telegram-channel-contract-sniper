require("dotenv").config();
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const fs = require("fs");

const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;
const sessionFile = "session.txt";

// Load session from file if exists
const sessionString = fs.existsSync(sessionFile) ? fs.readFileSync(sessionFile, "utf-8") : "";
const session = new StringSession(sessionString || "");

const client = new TelegramClient(session, apiId, apiHash, {
  connectionRetries: 5,
});

async function startTelegram() {
  await client.start({
    phoneNumber: async () => process.env.PHONE || await input.text("📱 Enter phone number: "),
    phoneCode: async () => await input.text("📩 Enter the code sent to Telegram: "),
    password: async () => await input.text("🔐 Enter your 2FA password (if enabled): "),
    onError: (err) => console.log("❌ Telegram error:", err),
  });

  console.log("✅ Logged in successfully!");

  // Save session to file
  fs.writeFileSync(sessionFile, client.session.save());
  console.log("💾 Session saved!");
}

module.exports = { client, startTelegram };
