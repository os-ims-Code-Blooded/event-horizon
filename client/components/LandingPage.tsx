import React, {FC} from 'react';
import  {Link} from 'react-router-dom';

type LandingProps = {
  user: Object | null;
  handleLogin: Function;
};
const LandingPage: FC<LandingProps> = ({user, handleLogin}) => {

  return (
    <div className='bg-slate-900 dark:bg-black flex flex-col items-center justify-center h-screen text-white'>
      <div className='p-5'>
        GAME BIO STUFFS
      </div>
      <div className='p-5'>
        IMAGES
      </div>
      <div className='justify-items-center flex'>
        {!user && (
              <Link
              to="/login"
              type="button"
              onClick={() => handleLogin()}
              className='w-96 py-6 text-2xl p-3 bg-gradient-to-t from-green-300 to-emerald-600 text-white shadow-emerald-500 rounded-lg shadow-sm text-center hover:bg-orange-900'
            >
              Sign Up / Login
            </Link>
            )}
      </div>
    </div>
  )
}

export default LandingPage;