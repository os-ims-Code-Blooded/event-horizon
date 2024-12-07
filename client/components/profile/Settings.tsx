import React, {useState, useEffect} from 'react';
import axios from 'axios';

type SettingsProps = {
  user: any;
  fetchUser: ()=> void;
};
const Settings = ({user, fetchUser}) =>{

  const [darkMode, setDarkMode] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [name, setName] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  const changeName = async () => {

    try {
      await axios.patch(`/profile/${user.id}`, {
        name: name
      })
      setIsEditing(false);
      fetchUser();
    } catch (error) {
      console.error(`Failure on request to change name.`)
    }
  };

  // function to send update request to Users_Settings
  const updateUserSetting = async (field: string, value: boolean) => {
    try {
      console.log('FIELD - VALUE', {[field]: value})
      await axios.patch(`/profile/settings/${user.id}`, {
        data: {
          [field]: value,
        }
      });
    } catch (error) {
      console.error(`Failed to update ${field} for user ${user.id}`);
    }
  };
  // handle toggle event for dark mode
  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await updateUserSetting('dark_mode', newValue);
    fetchUser();
  };

  //handle toggle event for color blind mode
  const toggleColorBlindMode = async () => {
    const newValue = !colorBlindMode;
    setColorBlindMode(newValue);
    await updateUserSetting('colorblind_mode', newValue);
    fetchUser();
  };

  const promptDelete = () => {
    setShowDeletePrompt(true);
  };

  const confirmDelete = async () => {
    try {
      if (user) {
        const deletedUser = await axios.delete(`/profile/${user.id}`);
        if (deletedUser.status === 204) {
          setShowDeletePrompt(false);
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Failed to delete friend');
    }
  };

  const cancelDelete = () => {
    setShowDeletePrompt(false);
  };


  //on render fetcher users settings info
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const userSettings = await axios.get(`/profile/settings/${user.id}`);
        const { dark_mode, colorblind_mode } = userSettings.data;
        setDarkMode(dark_mode);
        setColorBlindMode(colorblind_mode);
      } catch (error) {
        console.error(`Failed to fetch settings for user #${user.id}:`, error);
      }
    };

    if (user.id) {
      fetchUserSettings();
    }
  }, [user.id]);


  return (
    <div
      className="pt-10 flex flex-col items-center bg-starfield gap-5 text-white p-6 rounded-lg shadow-md h-screen sm:grid-cols-1"
      aria-label="User Settings Page"
    >
      <h1 className="text-center text-3xl font-bold pt-10">USER SETTINGS</h1>
      <div className="mt-8 w-full max-w-2xl justify-center justify-items-center items-center flex-col flex">
        <table className="table-auto border-s-orange-100 w-full bg-gray-800 text-left text-sm rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gray-700 text-gray-200">
              <th className="px-4 py-2">Setting</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* User's  information */}
          <tr className="border-b border-gray-700">
              <td className="px-4 py-3">Username</td>
              <td className="px-4 py-3">Display name for a User</td>
              <td className="px-4 py-3">
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <label htmlFor="name-input" className="sr-only">
                    Edit name
                  </label>
                  <input
                    type="text"
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    aria-label="Enter your name"
                  />
                  <button
                    onClick={changeName}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    aria-label="Save name changes"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    aria-label="Cancel name changes"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div
                  className="p-2 anime-pulse border rounded focus:outline-none text-white cursor-pointer hover:border-blue-500"
                  onClick={() => setIsEditing(true)}
                  aria-label={`Name: ${name}. Click to edit.`}
                >
                  {name}
                </div>
              )}
              </td>
            </tr>
            {/* Theme Settings */}
            <tr className="border-b border-gray-700">
              <td className="px-4 py-3">Dark Mode</td>
              <td className="px-4 py-3">Toggle dark mode for the application.</td>
              <td className="px-4 py-3">
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                    darkMode ? 'bg-green-500' : 'bg-slate-500'
                  }`}
                  aria-label="Toggle Dark Mode"
                >
                  <span
                    className={`${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                  ></span>
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">Color-Blind Mode</td>
              <td className="px-4 py-3">
                Adjust colors for better visibility for color-blind users.
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={toggleColorBlindMode}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                    colorBlindMode ? 'bg-green-500' : 'bg-slate-500'
                  }`}
                  aria-label="Toggle Color-Blind Mode"
                >
                  <span
                    className={`${
                      colorBlindMode ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                  ></span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div className='flex justify-center gap-8 mt-4 pt-50'>
          <button 
            className='justify-center items-center justify-items-center bg-error hover:animate-pulse hover:bg-slate-500 text-text w-60 h-15'
            onClick={() => promptDelete()}
          >
            DELETE ACCOUNT
          </button>
        </div>
        <div>
          {showDeletePrompt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-4 bg-slate-700 rounded shadow-lg w-full max-w-sm">
              <h2 className="text-lg font-bold mb-2">Confirm Deletion</h2>
              <p className="text-md text-white">
                Are you sure you want to delete this friend?
              </p>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  className="px-4 py-2 bg-slate-300 text-slate-700 rounded hover:bg-slate-400"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-error text-white rounded hover:bg-text"
                  onClick={confirmDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;