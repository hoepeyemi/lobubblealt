import { NextApiRequest, NextApiResponse } from 'next';
import TelegramBot from 'node-telegram-bot-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET method with proper authorization
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Validate admin token for security
  const { token } = req.query;
  const adminToken = process.env.ADMIN_TOKEN;
  
  if (!adminToken || token !== adminToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const webhookSecret = process.env.WEBHOOK_SECRET_PATH || 'secret-path';
    const vercelUrl = process.env.VERCEL_URL || req.headers.host;
    
    if (!botToken) {
      return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN is not set' });
    }
    
    if (!vercelUrl) {
      return res.status(500).json({ error: 'VERCEL_URL is not set' });
    }
    
    // Create a temporary bot instance to set the webhook
    const bot = new TelegramBot(botToken);
    
    // The full webhook URL
    const webhookUrl = `https://${vercelUrl}/api/webhook/${webhookSecret}`;
    
    // Set the webhook
    const result = await bot.setWebHook(webhookUrl);
    
    if (result) {
      res.status(200).json({ 
        success: true, 
        message: 'Webhook set successfully',
        webhookUrl
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to set webhook'
      });
    }
  } catch (error) {
    console.error('Error setting webhook:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error setting webhook',
      error: (error as Error).message
    });
  }
} 