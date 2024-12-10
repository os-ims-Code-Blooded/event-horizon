import React, { useEffect, useState, FC } from 'react';
import axios from 'axios';

const LeaderBoard = ({user, fullScreen=true}) => {
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
      } w-full bg-starfield text-white dark:text-slate-200 flex flex-col items-center rounded-md pt-15`}
    >
      <h1 className={`${fullScreen ? 'pt-20' : ''} text-2xl font-bold mb-4`}>Leader Board</h1>
      <table className="table-auto border-collapse border border-slate-500">
        <thead>
          <tr className="bg-slate-700">
            <th className="border border-slate-600 px-4 py-2">Rank</th>
            <th className="border border-slate-600 px-4 py-2">Name</th>
            <th className="border border-slate-600 px-4 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {users.map((boardUser: any, index) => (
            <tr
              key={boardUser.id}
              className={`even:bg-slate-800 ${index === 0 ? 'font-bold' : ''} ${
                user.id === boardUser.id ? 'animate-pulse bg-yellow-300 text-white' : ''
              }`}
            >
              <td className="border border-slate-600 px-4 py-2">{index + 1}</td>
              <td className="border border-slate-600 px-4 py-2">{boardUser.name}</td>
              <td className={`${user.id === boardUser.id ? 'text-black' : 'text-yellow-600'}border border-slate-600 px-4 py-2`}>
                {boardUser.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoard;