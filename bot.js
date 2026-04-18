require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const { Ollama } = require("ollama");

console.debug("Starting AI Translator bot...");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ]
});
console.debug("Discord client initialized with intents.");

const MODEL = process.env.MODEL || "mistral";
const OLLAMA_URL = process.env.OLLAMA_URL || "https://ollama.com";
const CHANNEL_LIMIT = process.env.TRANSLATE_CHANNEL || null;
const APP_ID = process.env.APP_ID || null;

console.debug(`Using model: ${MODEL}`);
console.debug(`Ollama URL: ${OLLAMA_URL}`);
console.debug(`Channel limit: ${CHANNEL_LIMIT ? CHANNEL_LIMIT : "None (all channels)"}`);

const FLAG_LANG = {
  "🇺🇸": "English",
  "🇵🇭": "Filipino (Tagalog)",
  "🇲🇾": "Malay",
  "🇫🇷": "French",
  "🇵🇱": "Polish",
  "🇩🇪": "German",
  "🇪🇸": "Spanish",
  "🇮🇹": "Italian",
  "🇷🇺": "Russian ",
  "🇨🇳": "Chinese (Simplified)",
  "🇧🇷": "Portuguese (Brazilian)",
  "🇳🇿": "English (New Zealand)",
};

const oll = new Ollama({
  host: OLLAMA_URL,
  headers: {
    Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
  },
});

console.debug("Ollama client initialized.");

async function aiTranslate(text, targetLang) {

  try {

    const prompt = `
      You are a professional translator.
      
      Translate the message into ${targetLang}.
      Preserve meaning and tone.
      Return ONLY the translated sentence.

      Message:
      ${text}
      `;

    return await executeAIPrompt(prompt);

  } catch (err) {
    console.error("AI translation error:", err.message);
    return null;
  }
}

client.once("ready", () => {
  console.log(`AI Translator ready: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  console.debug(`Received message: ${message.content} (ID: ${message.id}) in channel ${message.channel.id} by ${message.author.tag}`);

  if (message.author.bot) return;
  if (!message.content.trim()) return;

  if (CHANNEL_LIMIT && message.channel.id !== CHANNEL_LIMIT) return;

  
  if (process.env.SUGGEST_FLAG === "true") {
    try {
      for (const emoji of Object.keys(FLAG_LANG)) {
        if (!message.reactions.cache.has(emoji)) {
          await message.react(emoji);
        }
      }
    } catch (err) {
      console.log("Reaction error:", err.message);
    }
  }
  
  if (message.mentions.users.size > 0 && message.mentions.users.has(APP_ID)) {
    const reply = await replyToMention(message.content);

    if (!reply) return;
    await message.reply(reply);
  }

});

client.on("messageReactionAdd", async (reaction, user) => {
  console.debug(`Reaction added: ${reaction.emoji.name} by ${user.tag} on message ID ${reaction.message.id}`);
  if (user.bot) return;

  const emoji = reaction.emoji.name;
  const flagRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/u;
  if (!FLAG_LANG[emoji]) {
    if (flagRegex.test(emoji)) {
      return reaction.message.reply(`Sorry, that language (${emoji}) isn't supported for translation. Please contact the admin to add it.`);
    }
    return;
  }

  const message = reaction.message;

  // if (message.author.bot) return;

  const targetLang = FLAG_LANG[emoji];

  try {

    const translated = await aiTranslate(message.content, targetLang);

    if (!translated) return;

    if (emoji === "🇳🇿") {
      await message.reply(
        `${emoji} **${targetLang} Righto, mate! Here’s your translation:**\n${translated}`
      );
    } else {
      await message.reply(
        `${emoji} **${targetLang} Translation:**\n${translated}`
      );
    }

  } catch (err) {
    console.error("Reaction translate error:", err.message);
  }

});

console.debug("Logging in to Discord...");
client.login(process.env.DISCORD_TOKEN);
console.debug("Discord login initiated.");

async function replyToMention(text) {

  try {

    const prompt = `
      You are discord bot, pretending to be Denver, a character from TV Series Money Heist.
      
      Respond to the message in such a Denver way.

      Message:
      ${text}
      `;

    return await executeAIPrompt(prompt);

  } catch (err) {
    console.error("AI Reply To Mention error:", err.message);
    return null;
  }
}

async function executeAIPrompt(prompt) {
  const response = await oll.chat({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.message.content.trim();
}
