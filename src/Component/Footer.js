import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className=" w-full max-w-md flex justify-around mt-6">
      <Link to="/" className="flex flex-col items-center text-zinc-400">
        <span className="material-icons text-zinc-400">house</span>
        Home
      </Link>
      <Link to="/tasks" className="flex flex-col items-center text-zinc-400">
        <span className="material-icons text-zinc-400">assignment</span>
        Tasks
      </Link>
      <Link to="/squad" className="flex flex-col items-center text-zinc-400">
        <span className="material-icons text-zinc-400">group</span>
        Squad
      </Link>
      <Link to="/farm" className="flex flex-col items-center text-zinc-400">
        <span className="material-icons text-zinc-400">rocket</span>
        Farm
      </Link>
    </div>
  );
};

export default Footer;
