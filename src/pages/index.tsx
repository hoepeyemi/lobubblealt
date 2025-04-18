import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);
      })
      .catch(err => {
        console.error('Error fetching status:', err);
        setStatus('Error connecting to bot');
      });
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Solana Wallet & Bubblemap Bot</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Telegram bot for Solana wallet generation and bubblemap analysis" />
      </Head>

      <main>
        <h1>Solana Wallet & Bubblemap Bot</h1>
        
        <div className="card">
          <h2>Bot Status: <span className={status === 'Running' ? 'online' : 'offline'}>{status}</span></h2>
          
          <p>This Telegram bot allows users to:</p>
          <ul>
            <li>Generate Solana vanity wallet addresses with custom prefixes</li>
            <li>Analyze token distributions with Bubblemaps across multiple blockchains</li>
          </ul>
          
          <div className="button-group">
            <a href="https://t.me/your_bot_username" target="_blank" rel="noopener noreferrer" className="button primary">
              Open in Telegram
            </a>
            <a href="/docs" className="button secondary">
              View Documentation
            </a>
          </div>
          
          <div className="demo">
            <h3>Demo Video</h3>
            <a href="https://drive.google.com/drive/folders/1j74KjxCiLj34nQu2TDQPXz5hBrfAlHDN?usp=sharing" 
               target="_blank" rel="noopener noreferrer" className="demo-link">
              Watch Demo
            </a>
          </div>
        </div>
      </main>

      <footer>
        <p>Powered by Solana • Bubblemaps • Vercel</p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #f9fafb;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 800px;
        }

        h1 {
          margin: 0 0 2rem 0;
          line-height: 1.15;
          font-size: 3rem;
          text-align: center;
          color: #0070f3;
        }

        .card {
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

        .card h2 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          color: #333;
        }

        .card p {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .card ul {
          margin-bottom: 2rem;
        }

        .card li {
          margin: 0.5rem 0;
          font-size: 1.1rem;
        }

        .button-group {
          display: flex;
          gap: 1rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .button {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }

        .primary {
          background-color: #0070f3;
          color: white;
        }

        .primary:hover {
          background-color: #0051cc;
        }

        .secondary {
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
        }

        .secondary:hover {
          background-color: #ebebeb;
        }

        .online {
          color: green;
        }

        .offline {
          color: red;
        }

        .demo {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #eaeaea;
        }

        .demo-link {
          display: inline-block;
          margin-top: 0.5rem;
          color: #0070f3;
          text-decoration: none;
        }

        .demo-link:hover {
          text-decoration: underline;
        }

        footer {
          width: 100%;
          height: 60px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer p {
          color: #777;
        }

        @media (max-width: 600px) {
          .button-group {
            flex-direction: column;
          }
          
          h1 {
            font-size: 2rem;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
} 