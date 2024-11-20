import React, {FC} from 'react';

type ProfileProps = {
  updateView: Function,
  view: String
  user: Object | null;
  logOut: Function;
  getUser: Function;
};

const Profile: FC<ProfileProps> = ({updateView, view, user, logOut, getUser}) => {

  return(

    <div className='bg-slate-300 dark:bg-black dark:text-white text-black h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center space-y-3'>
        <h1 className='mb-10'>Profile</h1>
        <div className=''>Image</div>
        <div> Wins: 0 | Losses: 0</div>
        <button className="w-96 py-6 text-2xl p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600" onClick={(e) => updateView(e)} name="Cards">Cards</button>
        <button className="w-96 py-6 text-2xl p-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-blue-600">Friends</button>
        <button className="w-96 py-6 text-2xl p-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-blue-600">Settings</button>
        <button className="w-96 py-6 text-2xl p-3 bg-orange-400 text-white rounded-lg shadow-lg hover:bg-blue-600">Customize</button>
      </div>
    </div>

  )
}

export default Profile;