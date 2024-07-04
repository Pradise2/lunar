import React, { useEffect, useState } from 'react';
import Footer from '../Component/Footer';
import { saveProgress, getProgress } from '../firebaseConfig';

const Squad = () => {
  const [count, setCount] = useState(0);
  const [idme, setIdme] = useState("");
  const [claimLevel, setClaimLevel] = useState(false);
  const [userId, setUserId] = useState("");
  const [copied, setCopied] = useState(false);

  const formattedCount = new Intl.NumberFormat().format(count).replace(/,/g, "");

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
      } else {
        console.error('User data is not available.');
      }
    } else {
      console.error('Telegram WebApp script is not loaded.');
    }
  }, []);

  const copyToClipboard = () => {
    const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;

    if (userId) {
      setIdme(userId);
    }

    const reflink = `https://t.me/yourcoinhot_bot?start=ref_${userId}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(reflink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      }).catch(err => {
        console.error('Failed to copy text:', err);
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = reflink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <body className="min-h-screen bg-zinc-900 text-white flex flex-col justify-between bg-cover bg-center">
      <div className="flex-grow flex flex-col items-center p-6">
        <h1 className="text-center text-2xl font-bold">
          The bigger the tribe, the better the vibe!
        </h1>
        <div className="w-full max-w-md bg-zinc-800 rounded-lg p-4 mb-4">
          <p className="text-center text-zinc-400">Total Reward</p>
          <p className="text-center text-3xl font-bold">
            {formattedCount} <span className="text-purple-400"></span>
          </p>
        </div>
        <div className="w-full max-w-md bg-zinc-800 rounded-lg p-4 mb-4">
          <p className="text-center text-zinc-400">Your rewards</p>
          <p className="text-center text-3xl font-bold">
            0.00 <span className="text-purple-400"></span>
          </p>
          <p className="text-center text-zinc-400 mb-4">10% of your friends' earnings</p>
          <button className="w-full bg-zinc-700 text-zinc-500 py-2 rounded-lg">Claim</button>
        </div>
        <div className="w-full max-w-md bg-zinc-800 rounded-lg p-4 mb-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-zinc-400">group</span>
            <p>Your team</p>
          </div>
          <p>{userId ? `${userId.length} Users` : 'Loading...'}</p>
        </div>
        <div className="w-full max-w-md flex space-x-2 mt-5">
          <button className="flex-1 bg-gradient-to-r from-purple-800 to-indigo-800 py-2 rounded-lg">Invite friends</button>
          <button className="bg-zinc-700 p-2 rounded-lg" onClick={copyToClipboard}>
            {copied ? <span>Copied!</span> : <span>Copy</span>}
          </button>
        </div>
      </div>
      <footer className="w-full max-w-md flex justify-around fixed bottom-0 left-0  bg-zinc-800 py-2">
        <Footer />
      </footer>
    </body>
  );
};

export default Squad;
