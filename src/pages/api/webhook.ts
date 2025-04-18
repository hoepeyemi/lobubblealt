import { NextApiRequest, NextApiResponse } from 'next';
import TelegramBot from 'node-telegram-bot-api';
import { handleRegistration, handleWalletStatus, handlePrefixSuggestion } from '../../utils/registrationHandler';
import { handleBubblemapCommand, handleBubblemapConversation, handleChainSelection } from '../../utils/bubblemapHandler';
import { getUser, createUser } from '../../utils/userDatabase';

// Initialize bot instance (outside the handler to maintain state across requests)
let botInstance: TelegramBot | null = null;

// This is the secret path for the webhook
const SECRET_PATH = process.env.WEBHOOK_SECRET_PATH || 'secret-path';

// Initialize the bot if it hasn't been initialized
function initializeBot() {
  if (botInstance) return botInstance;
  
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
  }
  
  // Create the bot in webhook mode (no polling)
  botInstance = new TelegramBot(token, { webHook: true });
  return botInstance;
}

// Process update from Telegram
async function processUpdate(bot: TelegramBot, update: any) {
  try {
    // Handle callback queries
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const message = callbackQuery.message;
      if (!message) return;
      
      const chatId = message.chat.id;
      const data = callbackQuery.data;
      
      if (!data) return;
      
      if (data.startsWith('chain_')) {
        // Handle chain selection for bubblemap
        await handleChainSelection(bot, callbackQuery);
      } else {
        switch (data) {
          case 'register_start':
            await handleRegistration(bot, message, '/register');
            break;
          case 'show_wallet':
            await handleWalletStatus(bot, chatId);
            break;
          case 'cancel_registration':
            await bot.sendMessage(
              chatId, 
              'Registration canceled. You can start again anytime with the Register button.',
              getMainMenuKeyboard()
            );
            break;
          // Handle prefix suggestions
          case 'prefix_cool':
            await handlePrefixSuggestion(bot, chatId, 'COOL');
            break;
          case 'prefix_sol':
            await handlePrefixSuggestion(bot, chatId, 'SOL');
            break;
          case 'prefix_moon':
            await handlePrefixSuggestion(bot, chatId, 'MOON');
            break;
          default:
            console.log(`Unknown callback data: ${data}`);
            break;
        }
      }
      
      // Answer the callback query to remove the loading state
      await bot.answerCallbackQuery(callbackQuery.id);
      
      return;
    }
    
    // Handle text messages
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = msg.text || '';
      
      // Check for specific commands
      if (text.startsWith('/start')) {
        await handleStart(bot, msg);
        return;
      }
      
      if (text.startsWith('/help') || text === 'ℹ️ Help') {
        await handleHelp(bot, msg);
        return;
      }
      
      if (text.startsWith('/register') || text === '📝 Register') {
        await handleRegistration(bot, msg, text);
        return;
      }
      
      if (text.startsWith('/wallet') || text === '👛 My Wallet') {
        await handleWalletStatus(bot, chatId);
        return;
      }
      
      if (text.startsWith('/bubblemap') || text === '📊 Bubblemap') {
        // Don't treat "📊 Bubblemap" button text as part of the command
        if (text === '📊 Bubblemap' || text === '/bubblemap') {
          // Start fresh with just the command
          await handleBubblemapCommand(bot, { ...msg, text: '/bubblemap' });
        } else {
          // Pass through the full command with parameters
          await handleBubblemapCommand(bot, msg);
        }
        return;
      }
      
      // Check if it's a bubblemap conversation
      const isBubblemapConversation = await handleBubblemapConversation(bot, msg);
      if (isBubblemapConversation) return;
      
      // Handle registration flow for non-command text
      if (!text.startsWith('/') && 
          !text.startsWith('📝') && 
          !text.startsWith('👛') && 
          !text.startsWith('ℹ️') &&
          !text.startsWith('📊')) {
        await handleRegistration(bot, msg, text);
      }
    }
  } catch (err) {
    console.error('Error processing update:', err);
  }
}

// Create main menu keyboard
function getMainMenuKeyboard(): TelegramBot.SendMessageOptions {
  return {
    reply_markup: {
      keyboard: [
        [{ text: '📝 Register' }, { text: '👛 My Wallet' }],
        [{ text: 'ℹ️ Help' }, { text: '📊 Bubblemap' }]
      ],
      resize_keyboard: true
    }
  };
}

// Handle /start command
async function handleStart(bot: TelegramBot, msg: TelegramBot.Message): Promise<void> {
  const chatId = msg.chat.id;
  let user = getUser(chatId);
  if (!user) {
    user = createUser(chatId, msg.from?.username);
  }
  const firstName = msg.from?.first_name || 'there';
  
  await bot.sendMessage(
    chatId,
    `Hello ${firstName}! Welcome to the Solana Wallet & Bubblemap Bot! 🚀\n\n` +
    `This bot helps you generate Solana vanity wallet addresses and analyze crypto contracts with Bubblemaps.\n\n` +
    `Use the buttons below to navigate:`,
    getMainMenuKeyboard()
  );
}

// Handle /help command
async function handleHelp(bot: TelegramBot, msg: TelegramBot.Message): Promise<void> {
  const chatId = msg.chat.id;
  
  await bot.sendMessage(
    chatId,
    'Available commands:\n\n' +
    '📝 Register - Register and generate a Solana vanity wallet\n' +
    '👛 My Wallet - Check your wallet information\n' +
    '📊 Bubblemap - Generate a bubblemap for any contract\n' +
    'ℹ️ Help - Show available commands\n\n' +
    'You can also use text commands:\n' +
    '/start - Start the bot\n' +
    '/register - Start registration\n' +
    '/wallet - Check wallet info\n' +
    '/bubblemap - Generate bubblemap\n' +
    '/help - Show this help',
    getMainMenuKeyboard()
  );
}

// Handler function for API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Validate the path to ensure it matches our webhook secret
  const { path } = req.query;
  if (path !== SECRET_PATH) {
    return res.status(404).json({ message: 'Not found' });
  }
  
  try {
    // Initialize the bot
    const bot = initializeBot();
    
    // Process the update
    await processUpdate(bot, req.body);
    
    // Respond with success
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 