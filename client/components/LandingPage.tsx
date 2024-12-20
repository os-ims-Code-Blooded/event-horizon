import React, {FC} from 'react';
import  {Link} from 'react-router-dom';

type LandingProps = {
  user: Object | null;
  handleLogin: Function;
  isDarkMode: Boolean;
  isCbMode: Boolean;
  volume: any;
  click13: any;
};

const LandingPage: FC<LandingProps> = ({ user, click13, handleLogin, isDarkMode, isCbMode}) => {

  return (
    <div className=' max-h-screen' aria-label="Landing Page">
      <div className='relative flex flex-col items-center justify-center min-h-screen text-text pt-5'
        aria-labelledby="landing-page-title"
        // style={{height: '50%'}}
      >
        <div className={`absolute inset-0 bg-starfield-light bg-contain filter dark:bg-starfield z-9`}
          aria-labelledby="landing-page-title"></div>
          {isDarkMode ? 
          <img className='w-2/3 h-2/3 transform scale-80 relative z-10' src='https://i.imgur.com/e5Tmg4r.png' alt="Game graphic image"/>
          :
          <img className='w-2/3 h-2/3 transform scale-80 relative z-10' src='https://i.imgur.com/oM3zj2J.png' alt="Game graphic image"/>

          }
          {user && (
              <div className="w-28 h-28 rounded-full bg-slate-700 relative z-10">
                  <Link
                  to="/title-menu"
                  onClick={click13}
                  type="button"
                  className="absolute inset-0 m-auto w-24 h-24 bg-success dark:bg-darkGreen text-text dark:text-darkText rounded-full shadow-md shadow-slate-200 flex items-center justify-center font-semibold text-center dark:hover:bg-emerald-800 hover:bg-green-700"
                  aria-label="Go to Title Menu and start playing"
                >
                  PLAY!
                </Link>
                </div>
                )}
        <div className='p-5 w-3/4 font-bold text-justify z-10' aria-labelledby="storyline-heading">
          {/* <div className='text-4xl text-center'>EVENT HORIZON</div> */}
          <br></br>
          <p className='text-text dark:text-darkText'>In a not too distant future, warring factions compete to mine powerful yet volatile dark matter crystals to fuel their warp engines for interstellar travel. This practice leads to the frequent formation of singularity events.</p>
          <br></br>
          <p className='text-text dark:text-darkText'>When two ships are caught in the pull of a black hole, the only hope for escape is to try and detonate the other's warp core--if one can create a warp breach, it will trigger a shockwave to propel the surviving ship with enough escape velocity to cross the boundary of the event horizon. The space vessels must inevitably battle, or both shall be pulled into void...</p>
          <br></br>
          <div className='justify-center justify-items-center flex bg-transparent' aria-label="Login or Sign Up section">
            {!user && (
              <div className="p-4 rounded-md flex flex-row bg-success dark:bg-darkGreen dark:hover:bg-green-800 hover:bg-emerald-800"
              onClick={() => {
                click13();
                handleLogin();
              }}
              >
                <svg className="w-6 h-6" viewBox="0 0 40 40">
                    <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                    <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                    <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                    <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
                  </svg>
                  <Link
                  to="/login"
                  type="button"
                  className="group h-full w-full bg-inherit dark:bg-inherit text-text dark:text-darkText flex items-center justify-center font-semibold text-center "
                  aria-label="Sign Up or Login"
                >
                  Sign Up / Login
                </Link>
                </div>
            
                )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage;

<div className="w-28 h-28 rounded-full bg-slate-700 relative">
          <Link
            to="/game-board"
            replace={true}
            className="absolute inset-0 m-auto w-24 h-24 bg-success dark:bg-darkGreen text-text rounded-full shadow-md shadow-slate-200 flex items-center justify-center text-xl font-semibold dark:hover:bg-slate-300 hover:animate-ping"
          >
            Play!
          </Link>
        </div>