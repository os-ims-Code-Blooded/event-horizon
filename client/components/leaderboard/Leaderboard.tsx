import React, { useEffect, useState, FC } from 'react';
import axios from 'axios';

const LeaderBoard = ({user, volume, fullScreen=true}) => {
  const [users, setUsers] = useState([]);

  // fetch top 10 users
  const fetchLeaderboard = async () => {
    await axios.get(`/profile/top-scores/${user.id}`)
      .then((topUsers) => {
        if(topUsers) {
          setUsers(topUsers.data);
        } else {
          console.error('failed to get users')
        }
      })
      .catch((err) => {
        console.error('Failed to fetch leaderboard');
      })
  };

  useEffect(() => {

    fetchLeaderboard();
  }, []);

  return (
    <div
      className={`${
        fullScreen ? 'h-screen' : 'h-full'
      } w-full bg-starfield text-white dark:text-slate-200 flex flex-col items-center rounded-lg`}
    >
      <h1 className={`${fullScreen ? 'pt-20' : ''} text-2xl font-bold mb-4`}>Leader Board</h1>
      <table className="table-auto">
        <thead className='rounded-t-md'>
          <tr className="bg-slate-700">
            <th className="px-4 py-2 rounded-tl-lg">Rank</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2 rounded-tr-lg">Score</th>
          </tr>
        </thead>
        <tbody>
          {
            users 
            ? users.map((boardUser: any, index) => {
  
              if (index !== users.length - 1){
                return (
  
                <tr
                  key={boardUser.id}
                  className={`${index === 0 ? 'font-bold' : ''} ${
                    user.id === boardUser.id ? 'animate-pulse bg-yellow-300 text-yellow-800 font-bold' : 'even:bg-slate-800 odd:bg-slate-600'
                  }`}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{boardUser.name}</td>
                  <td className={`${user.id === boardUser.id ? 'text-yellow-800 font-bold' : 'text-white'} px-4 py-2`}>
                    {boardUser.score}
                  </td>
                </tr>
                )
              } else {
                return (
                  <tr
                  key={boardUser.id}
                  className={`${index === 0 ? 'font-bold' : ''} ${
                    user.id === boardUser.id ? 'animate-pulse bg-yellow-300 text-yellow-800 font-bold' : 'even:bg-slate-800 odd:bg-slate-600'
                  }`}
                >
                  <td className="px-4 py-2 rounded-bl-lg">{index + 1}</td>
                  <td className="px-4 py-2">{boardUser.name}</td>
                  <td className={`${user.id === boardUser.id ? 'text-yellow-800 font-bold' : 'text-white'} px-4 py-2 rounded-br-lg`}>
                    {boardUser.score}
                  </td>
                </tr>                
                )
              }
  
            })
            :
            <tr>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">Loading latest rankings...</td>
              <td className="px-4 py-2">-</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoard;