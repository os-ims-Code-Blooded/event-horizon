import React, {FC} from 'react';

type NavProps = {
  updateView: Function,
  view: String;
  user: Object | null;
  getUser: Function;
  logOut: Function;
};

const NavigationBar: FC<NavProps> = ({logOut, getUser, user, view, updateView }) => {

  switch(view) {
    case 'Dock':
      return (
        <nav className="p-4 bg-gradient1 text-white flex items-center justify-between space-x-4">
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

        </nav>
      )
    case 'TitleMenu':
      return (
        <nav className="p-4 bg-gradient1 text-white flex items-center">
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

          </ul>
        </nav>
      );
      case 'Instructions':
        return (
          <nav className="p-4 bg-gradient1 text-white flex items-center">
            <button onClick={(e) => updateView(e)} name='Dock'>EVENT HORIZON</button>
            {!user && view === 'Instructions' && (
              <button type="button" onClick={(e) => updateView(e)}  className='' name="Instructions">How To Play</button>
            )}
          </nav>
        )
  }
};


export default NavigationBar;