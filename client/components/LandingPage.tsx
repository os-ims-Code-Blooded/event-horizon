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
    <div className='bg-slate-900 flex flex-col items-center justify-center h-screen text-white'>
      <div className='p-5'>
        GAME BIO STUFFS
      </div>
      <div className='p-5'>
        IMAGES
      </div>
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
    </div>
  )
}

export default LandingPage;