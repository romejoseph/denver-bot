require("dotenv").config();
const { Ollama } = require("ollama");

const MODEL = process.env.MODEL || "mistral";
const OLLAMA_URL = process.env.OLLAMA_URL || "https://ollama.com";

const oll = new Ollama({
  host: OLLAMA_URL,
  headers: {
    Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
  },
});

async function executeAIPrompt(prompt) {
  const response = await oll.chat({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
  });

  return response?.message?.content?.trim();
}

async function executeAIPromptWithContext(context, prompt) {
  const response = await oll.chat({
    model: MODEL,
    messages: [
      { role: 'system', content: context },
      { role: 'user', content: prompt },
    ],
  });

  return response?.message?.content?.trim();
}

async function aiTranslate(text, targetLang) {
  const prompt = `\nYou are a professional translator.\n\nTranslate the message into ${targetLang}.\nPreserve meaning and tone.\nReturn ONLY the translated sentence.\n\nMessage:\n${text}\n`;

  try {
    return await executeAIPrompt(prompt);
  } catch (err) {
    console.error("AI translation error:", err.message || err);
    return null;
  }
}

async function replyToMention(text) {
  const prompt = `\nYou are discord bot, pretending to be Denver, a character from TV Series Money Heist.\n\nRespond to the message in such a Denver way.\n\nMessage:\n${text}\n`;

  try {
    return await executeAIPrompt(prompt);
  } catch (err) {
    console.error("AI Reply To Mention error:", err.message || err);
    return null;
  }
}

async function ollamaWebSearch(query, maxResults = 1) {
  return oll.webSearch({ query, maxResults });
}

module.exports = {
  aiTranslate,
  replyToMention,
  executeAIPromptWithContext,
  ollamaWebSearch,
};
