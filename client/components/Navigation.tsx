import React, { FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

type NavProps = {
  user: Object | null;
  toggleDarkMode: () => void;
  handleLogin: Function;
  cbMode: () => void;
  isDarkMode: Boolean;
};

const NavigationBar: FC<NavProps> = ({ cbMode, isDarkMode, toggleDarkMode, user, handleLogin }) => {
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
      { label: 'Profile', path: 'user-profile', showWhenLoggedIn: true },
      { label: 'PLAY!', path: '/title-menu', showWhenLoggedIn: true }
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
      { label: 'Profile', path: '/user-profile', showWhenLoggedIn: true },

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
    <nav className="fixed z-10 top-0 w-full p-4 shadow-lg bg-fifth dark:!bg-third cbMode:bg-darkCbBg flex items-center justify-between text-text">
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
          {isDarkMode ?
            <svg data-toggle-icon="moon" className="w-3.5 h-3.5 " xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
              <path d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z"></path>
            </svg> :
            <svg data-toggle-icon="sun" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z"></path>
          </svg>
        }
        </button>
        <button onClick={cbMode} className="hover:text-blue-600">
          CB
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
