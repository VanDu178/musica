import React from "react";
import { FaSpotify } from "react-icons/fa";
import { GoBell, GoHomeFill } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import "./components.css";

const Header = () => {
    return (
      <header className="spotify-header">
        <div className="logo">
          <FaSpotify size={32} color="white" title="Spotify"/>
          <div className="home-search">
            <button className="home-button"><GoHomeFill color="white" size={36} title="Home"/></button>
            <div className="search-bar">
              <div className="search-icon"><IoSearchOutline  size={24} color="white" title="Search"/></div>
              <input type="text" placeholder="What do you want to play?" />
            </div>
          </div>
          
        </div>

        <div className="premium-download">
          <nav className="nav-links premium" title="Upgrade to Premium">
            <button>Explore Premium</button>
          </nav>
          <nav className="nav-links download">
            <button><MdOutlineDownloadForOffline size={20} color="white"/>Install App</button>
          </nav>
          <nav className="nav-links news glow-zoom">
            <button><GoBell size={20} color="white" title="What's New"/></button>
          </nav>
        </div>
        
        <div className="user-profile vertical-align">
          <img src="https://via.placeholder.com/40" alt="User" />
        </div>
      </header>
    );
  };

export default Header;