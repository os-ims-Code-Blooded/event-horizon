import React, {FC} from 'react';
import  {Link} from 'react-router-dom';

type LandingProps = {
  user: Object | null;
  handleLogin: Function;
};

const LandingPage: FC<LandingProps> = ({ user, handleLogin}) => {

  return (
    <div className='pt-5 max-h-screen' aria-label="Landing Page">
      <div className='bg-starfield bg-contain dark:bg-black flex flex-col items-center justify-center min-h-screen text-text pt-5'
        aria-labelledby="landing-page-title"
        // style={{height: '50%'}}
      >
          <img className='w-2/3 transform: scale-80' src='https://i.imgur.com/e5Tmg4r.png' alt="Game graphic image"/>
          {user && (
              <div className="w-28 h-28 rounded-full bg-slate-700 relative">
                  <Link
                  to="/title-menu"
                  type="button"
                  className="absolute inset-0 m-auto w-24 h-24 bg-success dark:bg-darkGreen text-text rounded-full shadow-md shadow-slate-200 flex items-center justify-center font-semibold text-center dark:hover:bg-slate-300 hover:bg-green-700"
                  aria-label="Go to Title Menu and start playing"
                >
                  Play!
                </Link>
                </div>
                )}
        <div className='p-5 w-3/4 font-bold text-justify' aria-labelledby="storyline-heading">
          {/* <div className='text-4xl text-center'>EVENT HORIZON</div> */}
          <br></br>
          <p className='text-white'>In a not too distant future, warring factions compete to mine powerful yet volatile dark matter crystals to fuel their warp engines for interstellar travel. This practice leads to the frequent formation of singularity events.</p>
          <br></br>
          <p className='text-white'>When two ships are caught in the pull of a black hole, the only hope for escape is to try and detonate the other's warp core--if one can create a warp breach, it will trigger a shockwave to propel the surviving ship with enough escape velocity to cross the boundary of the event horizon. The space vessels must inevitably battle, or both shall be pulled into void...</p>
          <br></br>
          <div className='justify-center justify-items-center flex bg-transparent' aria-label="Login or Sign Up section">
            {!user && (
              <div className="w-28 h-28 rounded-full bg-slate-700 relative">
                  <Link
                  to="/login"
                  type="button"
                  onClick={() => handleLogin()}
                  className="absolute inset-0 m-auto w-24 h-24 bg-success dark:bg-darkGreen text-text rounded-full shadow-md shadow-slate-200 flex items-center justify-center font-semibold text-center dark:hover:bg-slate-300 hover:bg-green-700"
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