import React, { FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

type NavProps = {
  user: Object | null;
  toggleDarkMode: () => void;
  handleLogin: Function;
  cbMode: () => void;
};

const NavigationBar: FC<NavProps> = ({ cbMode, toggleDarkMode, user, handleLogin }) => {
  const location = useLocation();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    axios.post('/api/logout')
      .then(() => {
        window.location.href = '/';
      })
      .catch((err) => {
        console.error('Failed to logout!');
      });
  };

  // navigation items for routes
  const navItems: { [key: string]: { label: string; path: string; showWhenLoggedIn?: boolean; onClick?: () => void;  }[] } = {
    '/': [
      { label: 'How To Play', path: '/instructions' },
      { label: 'PLAY!', path: '/title-menu', showWhenLoggedIn: true },
      { label: 'Profile', path: 'user-profile', showWhenLoggedIn: true }
    ],
    '/instructions': [
      { label: 'PLAY!', path: '/title-menu', showWhenLoggedIn: true},
      { label: 'Profile', path: 'user-profile', showWhenLoggedIn: true }

    ],
    '/user-profile': [
      { label: 'PLAY!', path: '/title-menu' },
      { label: 'How To Play', path: '/instructions' },
    ],
    '/title-menu': [
      { label: 'Friends', path: '/friends' },
    ],
    '/friends': [
      { label: 'Profile', path: '/user-profile', showWhenLoggedIn: true },
      { label: 'How To Play', path: '/instructions', showWhenLoggedIn: true },
      { label: 'PLAY!', path: 'title-menu', showWhenLoggedIn: true }

    ],
    '/leaderboard': [
      { label: 'Profile', path: '/user-profile' },
      { label: 'How To Play', path: '/instructions' },
    ],
    '/game-board': [
      { label: 'Friends', path: '/friends' },
    ],
    '/settings': [
      { label: 'Friends', path: '/friends' },
      { label: 'Profile', path: '/user-profile' },
      { label: 'PLAY!', path: 'title-menu', showWhenLoggedIn: true }
    ],
    '/cards': [
      { label: 'Friends', path: '/friends' },
      { label: 'Profile', path: '/user-profile' },
      { label: 'PLAY!', path: 'title-menu', showWhenLoggedIn: true }
    ],
  };

  const commonNavItems = [
    { label: 'EVENT HORIZON', path: '/' },
    { label: 'Logout', path: '/', showWhenLoggedIn: true, onClick: handleLogout },
  ];

  const currentItems = navItems[location.pathname] || [];
  const displayedItems = [...commonNavItems, ...currentItems];

  const NavButton: FC<{
    label: string;
    path: string;
    onClick?: () => void;
    className?: string;
  }> = ({ label, path, onClick, className }) => (
    <Link
      to={path}
      onClick={onClick}
      className={`hover:text-blue-600 truncate ${className || ''}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="fixed z-10 top-0 w-full p-4 shadow-lg bg-fifth dark:bg-purple-950 flex items-center justify-between text-text">
      {/* Navigation Links */}
      <div className="hidden sm:flex items-center gap-x-8">
        {displayedItems
          .filter(item => (item.showWhenLoggedIn === undefined || user || !item.showWhenLoggedIn))
          .map(({ label, path, onClick }, index) => (
            <NavButton key={index} label={label} path={path} onClick={onClick} />
          ))}
      </div>

      {/* Mobile Dropdown */}
      <div className="relative sm:hidden">
        <button
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className="hover:text-blue-600"
        >
          ☰
        </button>
        {isDropdownOpen && (
          <div className="absolute left-1/2 top-full transform mt-2 w-48 bg-fifth dark:bg-purple-950 rounded shadow-lg">
            {displayedItems
              .filter(item => (item.showWhenLoggedIn === undefined || user || !item.showWhenLoggedIn))
              .map(({ label, path, onClick }, index) => (
                <Link
                  key={index}
                  to={path}
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onClick) onClick();
                  }}
                  className="block px-4 py-2 text-white hover:bg-orange-500 dark:hover:bg-purple-800"
                >
                  {label}
                </Link>
              ))}
          </div>
        )}
      </div>

      {/* Theme Toggle Buttons */}
      <div className="flex items-center space-x-2">
        <button onClick={toggleDarkMode} className="hover:text-blue-600">
          🌗
        </button>
        <button onClick={cbMode} className="hover:text-blue-600">
          -
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
