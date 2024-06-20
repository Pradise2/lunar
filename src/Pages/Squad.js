import React, { useEffect, useState } from 'react';
import Footer from '../Component/Footer';

const Squad = () => {
  const [count, setCount] = useState(0);
  const [idme, setIdme] = useState("");
  const [users, setUsers] = useState([]);
  const [copied, setCopied] = useState(false);

  

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center p-0">
      <h1 className="text-center text-2xl font-bold mb-6">
        The bigger the tribe, the better the vibe!
      </h1>
      <div className="w-full max-w-md bg-zinc-800 rounded-lg p-4 mb-4">
        <p className="text-center text-zinc-400">Total squad balance</p>
        <p className="text-center text-3xl font-bold">
          22’569.31 <span className="text-purple-400"></span>
        </p>
      </div>
      <div className="w-full max-w-md bg-zinc-800 rounded-lg p-4 mb-4">
        <p className="text-center text-zinc-400">Your rewards</p>
        <p className="text-center text-3xl font-bold">
          0.00 <span className="text-purple-400"></span>
        </p>
        <p className="text-center text-zinc-400 mb-4">10% of your friends earnings</p>
        <button className="w-full bg-zinc-700 text-zinc-500 py-2 rounded-lg">Claim</button>
      </div>
      <div className="w-full max-w-md bg-zinc-800 rounded-lg p-4 mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
        <span className="material-icons text-zinc-400">group</span>
          <p>Your team</p>
        </div>
        <p> 0 Users</p>
      </div>
      <div className="w-full max-w-md flex space-x-2 mt-5">
        <button  className="flex-1 bg-purple-500 py-2 rounded-lg">Invite friends</button>
        <button  className="bg-zinc-700 p-2 rounded-lg">
          {copied ? <span>Copied!</span> : <span>Copy</span>}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Squad;
