import React from 'react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="container">
      <main>
        <h1>Solana Wallet & Bubblemap Bot Documentation</h1>
        
        <div className="doc-card">
          <h2>Getting Started</h2>
          <p>
            The Solana Wallet & Bubblemap Bot offers two main features:
          </p>
          <ul>
            <li>Generate Solana vanity wallet addresses with custom prefixes</li>
            <li>Analyze token distributions across multiple blockchains</li>
          </ul>
          
          <h3>How to Use</h3>
          <p>
            1. Open the bot in Telegram by clicking <a href="https://t.me/your_bot_username" target="_blank" rel="noopener noreferrer">here</a>.<br />
            2. Start with the /register command to create your wallet.<br />
            3. Once registered, use /bubblemap to analyze any token.
          </p>
          
          <h3>Available Commands</h3>
          <ul className="command-list">
            <li><code>/start</code> - Initialize the bot</li>
            <li><code>/register</code> - Create a new Solana wallet</li>
            <li><code>/wallet</code> - View your wallet details</li>
            <li><code>/bubblemap</code> - Analyze token distribution</li>
            <li><code>/help</code> - Show available commands</li>
          </ul>
          
          <h3>Demo Video</h3>
          <p>
            Watch our demo video to see the bot in action:
          </p>
          <a 
            href="https://drive.google.com/drive/folders/1j74KjxCiLj34nQu2TDQPXz5hBrfAlHDN?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="button"
          >
            Watch Demo
          </a>
        </div>
      </main>

      <footer>
        <Link href="/">
          Back to Home
        </Link>
      </footer>

      <style jsx>{`
        h1 {
          margin: 0 0 2rem 0;
          font-size: 2.5rem;
          text-align: center;
          color: #0070f3;
        }
        
        .doc-card {
          margin: 1rem;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          width: 100%;
          background-color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        h2 {
          margin: 0 0 1rem 0;
          font-size: 1.8rem;
          color: #0070f3;
        }
        
        h3 {
          margin: 1.5rem 0 0.5rem 0;
          font-size: 1.3rem;
          color: #333;
        }
        
        .command-list {
          background-color: #f5f5f5;
          padding: 1rem 2rem;
          border-radius: 8px;
        }
        
        .command-list li {
          margin: 0.7rem 0;
        }
        
        code {
          background-color: #e2e2e2;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
        }
        
        .button {
          display: inline-block;
          background-color: #0070f3;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 1rem;
        }
        
        .button:hover {
          background-color: #0051cc;
        }
        
        footer {
          margin-top: 2rem;
        }
        
        footer a {
          color: #0070f3;
          text-decoration: underline;
        }
        
        @media (prefers-color-scheme: dark) {
          .doc-card {
            background-color: #1e1e1e;
            border-color: #333;
          }
          
          h2 {
            color: #3694ff;
          }
          
          h3 {
            color: #e0e0e0;
          }
          
          .command-list {
            background-color: #2d2d2d;
          }
          
          code {
            background-color: #3d3d3d;
          }
        }
      `}</style>
    </div>
  );
} 