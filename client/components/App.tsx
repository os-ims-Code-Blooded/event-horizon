import React, {useState, useEffect} from 'react';
import '../style.css';
import SelectGame from './game/SelectGame.tsx';
import Profile from './profile/Profile.tsx';
import LeaderBoard from './leaderboard/Leaderboard.tsx';
import UserCards from './cards/UserCards.tsx';
import NavigationBar from './Navigation.tsx';
import Instructions from './Instructions.tsx';
import TitleMenu from './navigations/TitleMenu.tsx';

interface User {
  id: number;
  name: String,
  email: String,
  username: String
}

export default function App (){

	const [view, setView] = useState<string>('Dock');
  const [user, setUser] = useState<User | null>(null);



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
      case 'Logout':
        setView('/');
      case 'Instructions':
        setView('Instructions');
      case 'Profile':
        setView('Profile');
      default:
        console.error('Cannot change View');
	}
}
useEffect(() => {
  setUser(user);
  console.log('user set')
})

  switch(view){
    case 'Dock':
      return (
          <div>
            <NavigationBar logOut={logOut} getUser={getUser} user={user} view={view} updateView={updateView}/>
            <Instructions logOut={logOut} getUser={getUser} user={user} view={view} updateView={updateView}/>
          </div>
        )
    case 'TitleMenu':
      return (
        <div>
          <NavigationBar logOut={logOut} getUser={getUser} user={user} view={view} updateView={updateView}/>
          <TitleMenu logOut={logOut} updateView={updateView} view={view} user={user}  />
        </div>
      )
    case 'Instructions':
      return (
        <div>
          <NavigationBar logOut={logOut} getUser={getUser} user={user} view={view} updateView={updateView}/>
          <Instructions logOut={logOut} updateView={updateView} view={view} user={user} />
        </div>
      )
      case 'Profile':
        return (
          <div>
            <NavigationBar logOut={logOut} getUser={getUser} user={user} view={view} updateView={updateView}/>

          </div>
        )
  }
}