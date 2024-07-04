import React, { useEffect, useState } from 'react';
import Footer from '../Component/Footer';
import { saveProgress, getProgress } from '../firebaseConfig';
import { useTotalBal } from '../Context/TotalBalContext';

const Squad = () => {
  const defaultData = {
    referralCount: 0,
    referralEarnings: 0,
    totalBalance: 0,
    newUserIds: [],
    claimedReferralCount: 0, // New property to track claimed referrals
  };

  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(defaultData.referralCount);
  const [referralEarnings, setReferralEarnings] = useState(defaultData.referralEarnings);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(defaultData.totalBalance);
  const [buttonColor, setButtonColor] = useState('bg-zinc-700'); // State to manage button color
  const [buttonText, setButtonText] = useState('Claim'); // State to manage button text
  const [userId, setUserId] = useState(null); // Added userId state
  const [userName, setUserName] = useState(null); // Added userName state
  const [newReferralCount, setNewReferralCount] = useState(0); // New state to track new referrals
  const [totalReferralCount, setTotalReferralCount] = useState(0); // New state to track total referrals

  window.Telegram.WebApp.expand();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
        setUserName(user.username);
      } else {
        console.error('User data is not available.');
      }
    } else {
      console.error('Telegram WebApp script is not loaded.');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const userData = await getProgress(userId);
          console.log('User data from Firestore:', userData);
          const currentReferralCount = userData.referralCount || defaultData.referralCount;
          const claimedReferralCount = userData.claimedReferralCount || defaultData.claimedReferralCount;
          const newReferrals = currentReferralCount - claimedReferralCount;

          setReferralCount(currentReferralCount);
          setReferralEarnings(newReferrals * 1000); // Assuming 1000 per referral
          setTotalBalance(userData.totalBalance || defaultData.totalBalance);
          setNewReferralCount(newReferrals);
          setTotalReferralCount(currentReferralCount); // Set total referral count
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    if (newReferralCount > 0) {
      setButtonColor('bg-purple-700'); // Change button color to purple if newReferralCount > 0
    } else {
      setButtonColor('bg-zinc-700'); // Change button color back to zinc if newReferralCount is 0
    }
  }, [newReferralCount]);

  useEffect(() => {
    const saveData = async () => {
      try {
        await saveProgress(userId, {
          referralCount,
          referralEarnings, 
          totalBalance,
          claimedReferralCount: referralCount, // Save the current referral count as claimed
        });
        console.log('User data saved successfully');
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    };

    const handleBeforeUnload = (e) => {
      if (userId) {
        saveData();
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (userId) {
        saveData();
        console.log('Saving user data on cleanup');
      }
    };
  }, [userId, referralCount, referralEarnings, totalBalance]);

  const handleClaim = () => {
    console.log('Claim button clicked');
    setButtonColor('bg-zinc-700'); // Change the button color back to zinc after clicking
    setButtonText('Claimed'); // Change the button text to "Claimed"
    setTotalBalance((prevTotalBalance) => prevTotalBalance + referralEarnings); // Add referralEarnings to totalBalance
    setReferralEarnings(0); // Reset referral earnings after claiming
    setNewReferralCount(0); // Reset new referral count after claiming
  };

  const copyToClipboard = () => {
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
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col justify-between bg-cover bg-center">
      <div className="flex-grow flex flex-col items-center p-6">
        <h1 className="text-center text-2xl font-bold">
          The bigger the tribe, the better the vibe!
        </h1>
        {!loading && (
          <>
            <div className="w-full max-w-md bg-zinc-800 rounded-lg p-4 mb-4">
              <p className="text-center text-zinc-400">Total Reward</p>
              <p className="text-center text-3xl font-bold">
                {totalBalance.toFixed(2)} <span className="text-purple-400"></span>
              </p>
            </div>
            <div className="w-full max-w-md bg-zinc-800 rounded-lg p-4 mb-4">
              <p className="text-center text-zinc-400">Your rewards</p>
              <p className="text-center text-3xl font-bold">
                {referralEarnings.toFixed(2)} <span className="text-purple-400"></span>
              </p>
              <p className="text-center text-zinc-400 mb-4">1000 per friend's refer</p>
              <button 
                className={`w-full py-2 rounded-lg ${buttonColor}`} 
                onClick={handleClaim}>
                {buttonText}
              </button>
            </div>
            <div className="w-full max-w-md bg-zinc-800 rounded-lg p-4 mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-zinc-400">group</span>
                <p>Your team</p>
              </div>
              <p>{totalReferralCount} Users</p> {/* Display total referral count */}
            </div>
          </>
        )}
        <div className="w-full max-w-md flex space-x-2 mt-5">
          <button className="flex-1 bg-gradient-to-r from-purple-800 to-indigo-800 py-2 rounded-lg" onClick={copyToClipboard}>
            Invite friends
          </button>
          <button className="bg-zinc-700 p-2 rounded-lg" onClick={copyToClipboard}>
            {copied ? <span>Copied!</span> : <span>Copy</span>}
          </button>
        </div>
      </div>
      <footer className="w-full max-w-md flex justify-around fixed bottom-0 left-0 bg-zinc-800 py-2">
        <Footer />
      </footer>
    </div>
  );
};

export default Squad;
