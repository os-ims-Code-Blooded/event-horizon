import React, {FC} from 'react';

type NavProps = {
  updateView: Function,
  view: String;
  user: Object | null;
  getUser: Function;
  logOut: Function;
  toggleDarkMode: Function;
};

const NavigationBar: FC<NavProps> = ({toggleDarkMode, logOut, getUser, user, view, updateView }) => {

  switch(view) {
    case 'Dock':
      return (
        <nav className="p-4 bg-gradient1 text-white flex items-center justify-between space-x-4 h-5">
          <button onClick={(e) => updateView(e)} name='Dock' className='p-3 hover:text-orange-400'>EVENT HORIZON</button>
          {!user && view === 'Dock' && (
            <button
            type="button"
            onClick={(e) => {
              updateView(e);
              getUser();
            }}
            className='hover:text-orange-400 p-3'
            name="TitleMenu"
          >
            Sign Up / Login
          </button>
          )}
          <button className='hover:text-orange-400 p-3' name="Instructions" onClick={(e) => updateView(e)}> How To Play</button>
          {user && view === 'Dock' && (
            <button type='button' onClick={(e) => updateView(e)} name='TitleMenu'
              className='hover:text-orange-400 p-3'
            >
              Play!
            </button>
          )}
          {user && view === 'Dock' && (
            <button type="button" onClick={(e) => {
              updateView(e);
              logOut();
            }}  className='hover:text-orange-400' name="Dock">Logout</button>
          )}
          <button onClick={() => toggleDarkMode()}>🌗</button>
        </nav>
      )
    case 'TitleMenu':
      return (
        <nav className="p-4 bg-gradient1 text-white flex items-center h-5">
          <button onClick={(e) => updateView(e)} name='Dock' className='p-3 hover:text-orange-400'>EVENT HORIZON</button>
          <ul className="flex ml-auto space-x-4">
            <li>
              <button type="button" onClick={(e) => updateView(e)}  className='hover:text-orange-400' name="Dock">Home</button>
            </li>
            <li>
             {user && view === 'TitleMenu' && (
              <button type='button' onClick={(e) => {
                updateView(e);
                logOut();
              }} className='hover:text-orange-400' name='Dock'> Logout</button>
             )}
            </li>
            <li>
              <button onClick={() => toggleDarkMode()}>🌗</button>
            </li>
          </ul>
        </nav>
      );
      case 'Instructions':
        return (
          <nav className="p-4 bg-gradient1 text-white flex items-center justify-between h-5">
            <button onClick={(e) => updateView(e)} name='Dock' className='hover:text-orange-400'>EVENT HORIZON</button>
            {!user && view === 'Instructions' && (
              <button type="button" onClick={(e) => updateView(e)}  className='' name="Instructions">How To Play</button>
            )}
            {user && (
              <button type="button" name="TitleMenu" onClick={(e) => updateView(e)} className='hover:text-orange-400'> Play!</button>
            )}
            <button onClick={() => toggleDarkMode()}>🌗</button>
          </nav>
        )
        case 'Profile':
          return (
            <nav className="p-4 bg-gradient1 text-white flex items-center justify-between h-5">
              <button onClick={(e) => updateView(e)} name='Dock' className='hover:text-orange-400'>EVENT HORIZON</button>
              <button onClick={(e) => updateView(e)} name='TitleMenu' className='hover:text-orange-400'>Play!</button>
              <button type="button" onClick={(e) => updateView(e)}  className='' name="Instructions">How To Play</button>
              <button onClick={() => toggleDarkMode()}>🌗</button>
            </nav>
          )
        case 'GameBoard':
          return (
            <nav className='p-4 bg-gradient1 text-white flex items-center justify-between h-5'>
              <button onClick={(e) => updateView(e)} name="Dock" className='hover:text-orange-400'>EVENT HORIZON</button>
              <button onClick={(e) => updateView(e)} name="Dock" className='hover:text-orange-400'>Menu</button>
              <button onClick={(e) => {
                updateView(e);
                logOut();
                }} name="Dock" className='hover:text-orange-400'>Log Out</button>
              <button onClick={() => toggleDarkMode()}>🌗</button>
            </nav>
          )
  }
};


export default NavigationBar;