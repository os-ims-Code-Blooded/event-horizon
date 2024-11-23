import React, {FC, useState} from 'react';
import { Link } from 'react-router-dom';
type ProfileProps = {
  user: Object | null;
};

const Profile: FC<ProfileProps> = ({user}) => {
  const [name, setName] = useState('Username');
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = (e) => {
    const newName = e.target.textContent;
    if (newName !== name) {
      setName(newName);
      setIsEditing(false);
    
    } else {
      setIsEditing(false);
    }

  }

  return(

    <div className='bg-slate-800 dark:bg-black dark:text-white text-slate-400 h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center space-y-3 text-center'>
        <h1 className='mb-10'>Profile</h1>
        <div
          className={`p-2 border rounded ${
            isEditing ? "border-blue-500" : ""
          } focus:outline-none focus:ring-2`}
          contentEditable
          suppressContentEditableWarning
          onFocus={() => setIsEditing(true)}
          onBlur={handleBlur}
          spellCheck="false"
        >
      {name}
    </div>
        <div className=''>Image</div>
        <div> Wins: 0 | Losses: 0</div>
        <Link type='button' className="w-96 py-6 text-2xl p-3 bg-blue-500 text-white rounded-lg shadow-md shadow-slate-600 hover:bg-blue-600" to="cards">Cards</Link >
        <Link type='button' className="w-96 py-6 text-2xl p-3 bg-green-500 text-white rounded-lg shadow-md shadow-slate-600 hover:bg-blue-600" to="friends" >Friends</Link >
        <Link type='button' className="w-96 py-6 text-2xl p-3 bg-gray-500 text-white rounded-lg shadow-md shadow-slate-600 hover:bg-blue-600" to="user-profile">Settings</Link >
        <Link type='button' className="w-96 py-6 text-2xl p-3 bg-orange-400 text-white rounded-lg shadow-md shadow-slate-600 hover:bg-blue-600" to='customize'>Customize</Link >
      </div>
    </div>
  )
}

export default Profile;