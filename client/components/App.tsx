import React, {useState, useEffect, useRef} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import '../style.css';
import SelectGame from './game/SelectGame.tsx';
import Profile from './profile/Profile.tsx';
import LeaderBoard from './leaderboard/Leaderboard.tsx';
import UserCards from './cards/UserCards.tsx';
import NavigationBar from './Navigation.tsx';
import Instructions from './Instructions.tsx';
import TitleMenu from './navigations/TitleMenu.tsx';
import LandingPage from './LandingPage.tsx';
import UserDecks from './cards/UserDecks.tsx'
import GameBoard from './game/GameBoard.tsx';
import Friends from './profile/Friends.tsx';
import axios from 'axios';
interface User {
  id: number;
  name: String;
  email: String;
  username: String;
}

export default function App (){
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  // dark mode toggle
  const toggleDarkMode = () => {
    // setIsDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle('dark')
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const fetchUser = async () => {
    const fetchedUser = await axios.get('/profile')
    .then((user) => {
      AuthCheck(user.data);
    })
    .catch((err) => {
      console.error('Failed to fetch user');
    });
  };

  const AuthCheck = async (user: any) => {
    try {

      const response = await axios.get('/api/auth-check');
      setIsAuthenticated(response.data.isAuthenticated);

      // Fetch user profile if authenticated
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
        console.log('user', response.data.user)
      } else {
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      throw new Error('Error checking auth', error);
    }
  };

  const getFriends = async () => {
    if(user) {
      const allFriends = await axios.get(`/friends/${user.id}`)
        .then((fetchedFriends) => {
          if(fetchedFriends) {
            console.log('friends back', friends);
            const notMe = fetchedFriends.data.filter((friend: any) => friend.id !== user.id);
            setFriends(notMe);
          }  else {
            console.error('Failed to fetch users friends');
          }
        })
        .catch((err) => {
          console.error('Failed to fetch friends');
        })
    } else {
      return [];
    }
  };

  useEffect(() => {
    if(!user) {
      fetchUser();
    }

}, [user]);

useEffect(() => {
  if (user && friends.length === 0) {
    getFriends();
  }
}, []);

  return (
    <>
      <NavigationBar
        toggleDarkMode={toggleDarkMode}
        user={user}
        handleLogin={handleLogin}
      />
      <Routes>
        <Route
          path="/"
          element={<LandingPage user={user} handleLogin={handleLogin}/>}
        />
        <Route
          path="/title-menu"
          element={isAuthenticated ? <TitleMenu user={user} /> : <Navigate to='/'/>}
        />
        <Route
          path="/instructions"
          element={<Instructions user={user} />}
        />
        <Route
          path="/user-profile"
          element={isAuthenticated ? <Profile user={user} /> : <Navigate to='/' />}
        />
        <Route
          path="/cards"
          element={isAuthenticated ? <UserDecks user={user} /> : <Navigate to='/' />}
        />
        <Route
          path="/game-board"
          element={isAuthenticated ? <SelectGame /> : <Navigate to='/' />}
        />
        <Route
          path="/friends"
          element={isAuthenticated ? <Friends user={user} friends={friends}/> : <Navigate to='/' />}
        />
      </Routes>
    </>
  );
}