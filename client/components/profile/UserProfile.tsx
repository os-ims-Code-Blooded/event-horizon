import React from 'react';

type UserProfProp = {
  user: any;
}
const UserProfile = ({user: any}) => {

  return (
    <div className='flex-cols'>
      <h1 className='justify-center'>{user.name}'s Profile</h1>
    </div>
  )
}

export default UserProfile;