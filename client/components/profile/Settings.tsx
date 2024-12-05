import React, {useState, useEffect} from 'react';
import axios from 'axios';

type SettingsProps = {
  user: any;
};
const Settings = ({user}) =>{

  const [darkMode, setDarkMode] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState(false);

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
  };
  
  //handle toggle event for color blind mode
  const toggleColorBlindMode = async () => {
    const newValue = !colorBlindMode;
    setColorBlindMode(newValue);
    await updateUserSetting('colorblind_mode', newValue);
  };
  //on render fetcher users settings info
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const userSettings = await axios.get(`/profile/settings/${user.id}`);
        const { dark_mode, colorblind_mode } = userSettings.data;
        console.log('dark', dark_mode);
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
      className="pt-10 flex flex-col items-center bg-radial-custom text-white p-6 rounded-lg shadow-md h-screen"
      aria-label="User Settings Page"
    >
      <h1 className="text-center text-3xl font-bold pt-5">USER SETTINGS</h1>
      <div className="mt-8 w-full max-w-2xl">
        <table className="table-auto w-full bg-gray-800 text-left text-sm rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gray-700 text-gray-200">
              <th className="px-4 py-2">Setting</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Theme Settings */}
            <tr className="border-b border-gray-700">
              <td className="px-4 py-3">Dark Mode</td>
              <td className="px-4 py-3">Toggle dark mode for the application.</td>
              <td className="px-4 py-3">
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                    darkMode ? 'bg-green-500' : 'bg-gray-500'
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
                    colorBlindMode ? 'bg-green-500' : 'bg-gray-500'
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
      </div>
    </div>
  );
};

export default Settings;