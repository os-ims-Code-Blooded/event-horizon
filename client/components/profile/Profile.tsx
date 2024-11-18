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

    <div className='bg-emerald-400 h-screen flex items-center'>
      <h1>Profile</h1>
      <div>Image</div>
      <div> Wins: 0 | Losses: 0</div>
      <button>Cards</button>
      <button>Friends</button>
      <button>Settings</button>
      <button>Customize</button>


    </div>

  )
}

export default Profile;