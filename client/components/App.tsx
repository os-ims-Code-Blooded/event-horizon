import React, {useState, useEffect, useRef} from 'react';
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
interface User {
  id: number;
  name: String,
  email: String,
  username: String
}

export default function App (){
  console.log('APP RENDER')
	const [view, setView] = useState<string>('Dock');
  const [user, setUser] = useState<User | null>(null);
  // const [isDarkMode, setIsDarkMode] = useState(false);
  const effectRan = useRef(false);

  // dark mode toggle
  const toggleDarkMode = () => {
    // setIsDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle('dark')
  };

  const getUser = () => {
    setUser({
      id: 1,
      name: 'Jeremy Hernandez',
      email: 'jeremy.hernandez504@gmail.com',
      username: '25th Baam'
    })
  };

  const logOut = () => {
    setUser(null);
  };


  //renderView
  function updateView(e) {

		switch (e.target.name){
			case 'Dock':
        setView('Dock');
        console.log('View changed to Landing page')
      break;
      case 'TitleMenu':
        setView('TitleMenu');
      break;
      case 'Instructions':
        setView('Instructions');
        break;
      case 'Profile':
        setView('Profile');
        break;
      case 'Cards':
        setView('Cards');
        break;
      case 'GameBoard':
        setView('GameBoard');
      default:
        console.error('Cannot change View');
	}
}
useEffect(() => {
  setUser(user);
})

  switch(view){
    case 'Dock':
      return (
          <div>
            <NavigationBar toggleDarkMode={toggleDarkMode} logOut={logOut} getUser={getUser} user={user} view={view} updateView={updateView}/>
            <LandingPage logOut={logOut} getUser={getUser} updateView={updateView} view={view} user={user}/>
          </div>
        )
    case 'TitleMenu':
      return (
        <div>
          <NavigationBar toggleDarkMode={toggleDarkMode} logOut={logOut} getUser={getUser} user={user} view={view} updateView={updateView}/>
          <TitleMenu logOut={logOut} getUser={getUser} updateView={updateView} view={view} user={user}  />
          <SelectGame/>
        </div>
      )
    case 'Instructions':
      return (
        <div>
          <NavigationBar toggleDarkMode={toggleDarkMode} logOut={logOut} getUser={getUser} user={user} view={view} updateView={updateView}/>
          <Instructions logOut={logOut} getUser={getUser} updateView={updateView} view={view} user={user} />
        </div>
      )
      case 'Profile':
        return (
          <div>
            <NavigationBar toggleDarkMode={toggleDarkMode}logOut={logOut} getUser={getUser} user={user} view={view} updateView={updateView}/>
            <Profile logOut={logOut} getUser={getUser} updateView={updateView} view={view} user={user}/>
          </div>
        )
      case 'Cards':
      return (
        <div>
          <NavigationBar toggleDarkMode={toggleDarkMode} logOut={logOut} getUser={getUser} user={user} view={view} updateView={updateView}/>
          <UserDecks logOut={logOut} getUser={getUser} updateView={updateView} view={view} user={user}/>
        </div>
      )
      case 'GameBoard':
        return (
          <div>
          <NavigationBar toggleDarkMode={toggleDarkMode} logOut={logOut} getUser={getUser} user={user} view={view} updateView={updateView}/>
            <GameBoard />
          </div>
        )
  }
}