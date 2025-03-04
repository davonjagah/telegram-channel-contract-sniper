const { Connection, Keypair, VersionedTransaction } = require("@solana/web3.js");
const axios = require("axios");
const bs58 = require("bs58");
require("dotenv").config();

const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";
const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote";
const JUPITER_SWAP_API = "https://quote-api.jup.ag/v6/swap";

const connection = new Connection(SOLANA_RPC_URL, "confirmed");

// Load wallet from private key
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) throw new Error("❌ Missing PRIVATE_KEY in .env");

const wallet = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));

async function buyToken(contractAddress) {
  try {
    console.log(`🔄 Attempting to buy ${contractAddress}...`);

    // Convert request body to query params
    const params = new URLSearchParams({
      inputMint: "So11111111111111111111111111111111111111112", // SOL token
      outputMint: contractAddress, // Token to buy
      amount: "6000000000", // 6 SOL
      slippageBps: "50", // 0.5% slippage
      swapMode: "ExactIn",
      userPublicKey: wallet.publicKey.toBase58(),
    });

    console.log("📤 Sending request to Jupiter API for quote...");
    console.log("🔍 Request URL:", `${JUPITER_QUOTE_API}?${params.toString()}`);

    // Step 1: Fetch best swap quote
    const quoteResponse = await axios.get(`${JUPITER_QUOTE_API}?${params.toString()}`);

    if (!quoteResponse.data) throw new Error("❌ Failed to get swap quote");

    console.log("✅ Swap quote received!", quoteResponse.data);

    // Step 2: Fetch swap transaction from Jupiter API
    console.log("📤 Requesting swap transaction...");
    
    const swapTxResponse = await axios.post(JUPITER_SWAP_API, {
      userPublicKey: wallet.publicKey.toBase58(),
      wrapAndUnwrapSol: true,  // Wraps SOL if needed
      computeUnitPriceMicroLamports: 300000, // Optional priority fee
      quoteResponse: quoteResponse.data
    });

    if (!swapTxResponse.data || !swapTxResponse.data.swapTransaction) {
      throw new Error("❌ Error: Missing swapTransaction in the response.");
    }

    console.log("✅ Swap transaction received!");

    // Step 3: Deserialize VersionedTransaction
    const swapTransaction = swapTxResponse.data.swapTransaction;
    const transactionBuffer = Buffer.from(swapTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(transactionBuffer);

    // Step 4: Sign transaction
    transaction.sign([wallet]);

    // Step 5: Send transaction
    const signature = await connection.sendTransaction(transaction, {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    console.log(`🚀 Transaction sent! Signature: https://solscan.io/tx/${signature}`);
  } catch (error) {
    console.error("❌ Error buying token:", error.response?.data || error.message);
  }
}

module.exports = { buyToken };
