require("dotenv").config();
const { client, startTelegram } = require("./telegramClient");
const { buyToken } = require("./buyToken");
const { NewMessage } = require("telegram/events");
const axios = require("axios");

const GROUP_IDS = [parseInt(process.env.TELEGRAM_GROUP_ID)]; // Replace with your target group IDs

async function monitorGroups() {
  try {
    await startTelegram(); // ✅ Ensure Telegram login before monitoring

    client.addEventHandler(async (event) => {
      try {
        const message = event.message?.message || "";
        const solanaCaRegex = /[A-Za-z0-9]{32,44}/g;
        const matches = message.match(solanaCaRegex);

        if (matches) {
          const contractAddress = matches[0];
          console.log(`🎯 Detected Contract: ${contractAddress}`);

          const isValid = await validateContract(contractAddress);
          if (isValid) {
            console.log("✅ Valid contract! Buying token...");
            await buyToken(contractAddress);
          } else {
            console.log("❌ Invalid contract, skipping.");
          }
        }
      } catch (error) {
        console.error("❌ Error processing message:", error);
      }
    }, new NewMessage({ chats: GROUP_IDS }));

    console.log("🚀 Listening for contract addresses...");
  } catch (error) {
    console.error("🚨 Bot crashed, restarting...", error);
    process.exit(1);
  }
}

async function validateContract(contractAddress) {
  try {
    const response = await axios.post("https://api.mainnet-beta.solana.com", {
      jsonrpc: "2.0",
      id: 1,
      method: "getAccountInfo",
      params: [contractAddress, { encoding: "jsonParsed" }],
    });

    return response.data.result !== null;
  } catch (error) {
    console.error("❌ Error validating contract:", error);
    return false;
  }
}

// ✅ Start monitoring
monitorGroups();
