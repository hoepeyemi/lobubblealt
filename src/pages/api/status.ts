import { NextApiRequest, NextApiResponse } from 'next';

// Simple API to check the bot status
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Always return running status for the frontend
  // In a production app, you might want to actually check the bot status
  res.status(200).json({
    status: 'Running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
} 