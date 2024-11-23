import React, {FC} from 'react';

type LandingProps = {
  updateView: Function,
  view: String;
  user: Object | null;
  getUser: Function;
  logOut: Function;
};
const LandingPage: FC<LandingProps> = ({updateView, view, user, getUser, logOut}) => {

  return (
    <>
    <div className='bg-slate-900 dark:bg-black flex flex-col items-center justify-center h-screen text-white'>
        <img className='w-2/3' src='https://i.imgur.com/8mBos8V.png'/>
      <div className='p-5 w-1/2 font-bold text-justify'>
        {/* <div className='text-4xl text-center'>EVENT HORIZON</div> */}
        <br></br>
        <p>In a not too distant future, warring factions compete to mine powerful yet volatile dark matter crystals to fuel their warp engines for interstellar travel. This practice leads to the frequent formation of singularity events.</p>
        <br></br>
        <p>When two ships are caught in the pull of a black hole, the only hope for escape is to try and detonate the other's warp core--if one can create a warp breach, it will trigger a shockwave to propel the surviving ship with enough escape velocity to cross the boundary of the event horizon. The space vessels must inevitably battle, or both shall be pulled into void...</p>
        <br></br>
      </div>
        <br></br>
      <div className='justify-items-center flex'>
        {!user && (
          <button
          type="button"
          onClick={(e) => {
            updateView(e);
            getUser();
          }}
          className='w-96 py-6 text-2xl p-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-orange-900'
          name="TitleMenu"
          >
              Sign Up / Login
            </button>
            )}
      </div>
            <br></br>
    </div>
    </>
  )
}

export default LandingPage;