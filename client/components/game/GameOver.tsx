import React, { useEffect, useState } from 'react';
import FxText from './FxText';
import useSound from 'use-sound';

import gameover from '../../sfx/gameover.wav'
import youwin from '../../sfx/youwin.wav'
import axios from 'axios';
import { response } from 'express';
import { use } from 'passport';


export default function GameOver ({
  gameWinner,
  user,
  volume,
  session
}){

  const [gameSummary, setGameSummary] = useState([])

  useEffect(() => {

    axios.get(`/games/end-game-summary/${session}`)
      .then((response) => {
        setGameSummary(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(`Error on GET request for game summary.`)
      })

  }, [])

  const [playGameOverSFX] = useSound(gameover, volume);
  const [playYouWinSFX] = useSound(youwin, volume);

  /** TODO:
   * Review this screen, unnecessary scrollbars? Maybe resolve via overflow or setting a max-width
   * Also, we should remove the background gradient that is extending beyond the screen, not sure what Z-level it is on but it is still there 
   */

  return (
    <div className='mt-15 h-full'>
        <div className='mt-15 p-4 justify-items-center flex flex-col items-center text-white h-full'>
          <div className='p-4 pt-8 justify-items-center flex flex-col items-center h-full'>
            <br></br>
            <br></br>
          { gameWinner === user.id 
          ? 
          <><div className='text-2xl z-30 text-green-600 font-bold'>VICTORY</div><div className='test-lg z-30 text-text dark:text-darkText'>Escape velocity achieved. Victory is yours. {playYouWinSFX()}</div></>
          : 
          <><div className='text-2xl z-30 text-error font-bold'>DEFEAT</div><div className='test-lg z-30 text-text dark:text-darkText'>You Lose. The remnants of your ship are sucked into the void. {playGameOverSFX()}</div></>
          }
            <br/>
            <table id="summary" className='text-white z-30 table-auto'>
              <thead className='rounded-t-md'>
                <tr className="bg-slate-700">
                  <th className={`pl-2 pr-2 text-center font-bold rounded-tl-lg`}>Round</th>
                  <th className={`pl-2 pr-2 text-center font-bold`}>Player</th>
                  <th className={`pl-2 pr-2 text-center font-bold`}>Health</th>
                  <th className={`pl-2 pr-2 text-center font-bold`}>Armor</th>
                  <th className={`pl-2 pr-2 text-center font-bold`}>Action</th>
                  <th className={`pl-2 pr-2 text-center font-bold`}>Card</th>
                  <th className={`pl-2 pr-2 text-center font-bold`}>Player</th>
                  <th className={`pl-2 pr-2 text-center font-bold`}>Health</th>
                  <th className={`pl-2 pr-2 text-center font-bold`}>Armor</th>
                  <th className={`pl-2 pr-2 text-center font-bold`}>Action</th>
                  <th className={`pl-2 pr-2 text-center font-bold rounded-tr-lg`}>Card</th>
                </tr>
              </thead>
              <tbody>
              { gameSummary ?
                Object.keys(gameSummary).map((round, index) => {
                  return (
                       <tr className='text-white even:bg-slate-800 odd:bg-slate-600' key={round}>
                      <td className={`pl-2 pr-2 text-center font-bold`} key={`${round}-${round}`}>{round}</td>
                      { Object.keys(gameSummary[round]).map((player, inner) => {
                            return (
                              <>
                              <td key={`player-${inner}`} className={`pl-4 pr-4 text-center ${ player === user.name ? 'text-green-600' : 'text-error' } font-bold`}>{player}</td>
                              <td key={`health-${inner}`} className={`pl-2 pr-2 text-center text-white font-bold`}>{gameSummary[round][player]["Information"].health}</td>
                              <td key={`armor-${inner}`} className={`pl-2 pr-2 text-center text-white font-bold`}>{gameSummary[round][player]["Information"].armor}</td>
                              <td key={`action-${inner}`} className={`pl-2 pr-2 text-center text-white font-bold`}>{gameSummary[round][player]["Actions"] ? gameSummary[round][player]["Actions"].action : '-'}</td>
                              <td key={`card-${inner}`} className={`pl-2 pr-2 text-center text-white font-bold`}>{gameSummary[round][player]["Actions"] ? (gameSummary[round][player]["Actions"].name && gameSummary[round][player]["Actions"].name.length > 0 ? gameSummary[round][player]["Actions"].name : '-') : '-'}</td>
                              </>
                            )
                        })
                      }
                      </tr>
                  )
                })
                :
                <tr>
                  <td>No game summary available at this time, we apologize for the inconvenience.</td>
                </tr>
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}