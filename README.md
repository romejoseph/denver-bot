# Denver Bot

A Discord bot that translates messages using Ollama AI and responds as a character-inspired assistant.

## What is this app?

`denver-bot` is a Discord bot built with `discord.js` that:
- reacts to messages with language flag emojis for suggested translations
- translates messages into a selected language when a supported flag reaction is added
- responds to direct mentions with a Denver-style reply
- supports a slash command for Age of Empires Mobile advice using live Ollama web search context
- can schedule periodic notifications in a channel using cron

## What does it do?

- Adds flag reaction suggestions to incoming messages when `SUGGEST_FLAG` is enabled
- Translates the original message content into the selected language via AI
- Replies with the translated text and custom formatting for New Zealand English
- Replies to bot mentions using a Denver-like personality
- Handles the `/aoem` command by performing a web search and answering with AI
- Supports enabling a recurring "lucky bag" notification schedule for a channel

## Key features

- AI translation via Ollama
- Reusable AI abstraction in `ai.js`
- Discord message reaction translation
- Mention-based character response
- Slash command interaction
- Channel-limited operation support
- Cron scheduling for recurring notifications

## Requirements

- Node.js 18+
- Discord bot application token
- Ollama API key and optional custom Ollama host

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file with values like:

```env
BOT_TOKEN=your_discord_bot_token
OLLAMA_API_KEY=your_ollama_api_key
MODEL=mistral
OLLAMA_URL=https://ollama.com
APP_ID=your_bot_user_id
TRANSLATE_CHANNEL=optional_channel_id
SUGGEST_FLAG=true
LUCKY_BAG_CRON=55 1,9,17 * * *
```

## Running the bot

```bash
npm start
```

## File structure

- `bot.js` — main Discord bot logic
- `ai.js` — reusable Ollama AI helper functions
- `package.json` — project dependencies and scripts

## Notes

- Make sure the bot has permissions for message content, reactions, and slash commands.
- `TRANSLATE_CHANNEL` restricts translation/reaction behavior to a single channel when set.
- `SUGGEST_FLAG=true` enables automatic flag reaction suggestions.
