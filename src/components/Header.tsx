import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-[#284b63] shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold tracking-wider">
          📺 Anime Search App
        </Link>
      </div>
    </header>
  );
};

export default Header;