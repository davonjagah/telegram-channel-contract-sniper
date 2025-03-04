# Telegram Solana Bot

## Introduction
This project is a Telegram bot that monitors specified Telegram groups for Solana contract addresses. When a valid contract address is detected, the bot automatically initiates a token purchase using the Jupiter aggregator. The bot integrates with the Solana blockchain and the Telegram API for decentralized trading.

## Features
- Monitors Telegram groups for Solana contract addresses
- Validates contract addresses before purchasing
- Executes token purchases via the Jupiter aggregator
- Saves Telegram session for seamless authentication

## Prerequisites
Before running the bot, ensure you have:
- **Node.js** installed ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Telegram API ID and Hash** (register at [my.telegram.org](https://my.telegram.org/))
- A Solana wallet private key
- Jupiter API access for swapping tokens

## Installation

### 1. Clone the Repository
```sh
git clone https://github.com/your-repo/telegram-solana-bot.git
cd telegram-solana-bot
```

### 2. Install Dependencies
Run the following command to install required packages:
```sh
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root with the following details:
```env
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash
PHONE=your_telegram_phone_number
PRIVATE_KEY=your_solana_wallet_private_key
TELEGRAM_GROUP_ID=your_target_group_id
```

## Running the Bot
Start the Telegram bot by running:
```sh
node monitor.js
```

## File Structure
```
📂 telegram-solana-bot
 ├── 📄 .env              # Environment variables
 ├── 📄 package.json      # Project dependencies
 ├── 📄 monitor.js        # Main bot logic
 ├── 📄 telegramClient.js # Telegram session handler
 ├── 📄 buyToken.js       # Token purchase logic
 ├── 📄 session.txt       # Saved Telegram session
```

## Usage
- The bot will listen to messages in the specified Telegram group.
- If a Solana contract address is detected, it validates the contract.
- If valid, the bot proceeds to purchase the token.
- Logs all operations to the console.

## Troubleshooting
- **Bot not starting?** Ensure that all dependencies are installed (`npm install`).
- **Login issues?** Double-check API credentials and Telegram session setup.
- **Contract validation failing?** Ensure the contract address is active and correct.

## License
This project is licensed under the MIT License. Feel free to modify and expand its functionality!