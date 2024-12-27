import React, { useEffect, useState } from 'react';
import FxText from './FxText';
import useSound from 'use-sound';

import gameover from '../../sfx/gameover.wav'
import youwin from '../../sfx/youwin.wav'
import axios from 'axios';
import { response } from 'express';


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
      })
      .catch((error) => {
        console.error(`Error on GET request for game summary.`)
      })

  }, [])

  const [playGameOverSFX] = useSound(gameover, volume);
  const [playYouWinSFX] = useSound(youwin, volume);




  console.log("USER ID", user.id, "GAME WINNER", gameWinner);

  return(
    <div className='mt-15 h-full'>
    {gameWinner === user.id?
        <div className='mt-15 p-4 justify-items-center flex flex-col items-center bg-radial-custom text-white h-full'>
          <div className='p-4 pt-8 justify-items-center flex flex-col items-center h-full'>
            <br></br>
            <br></br>
            <div className='text-xl z-30'>GAME OVER</div>


        <div className='test-lg z-30'>Escape velocity achieved. Victory is yours. {playYouWinSFX()}</div>


            <table id="summary" className='text-white z-30'>
              <thead>
                <tr>
                  <th className={`pl-2 pr-2 text-center`}>Round</th>
                  <th className={`pl-2 pr-2 text-center`}>Player</th>
                  <th className={`pl-2 pr-2 text-center`}>Health</th>
                  <th className={`pl-2 pr-2 text-center`}>Armor</th>
                  <th className={`pl-2 pr-2 text-center`}>Action</th>
                  <th className={`pl-2 pr-2 text-center`}>Card</th>
                  <th className={`pl-2 pr-2 text-center`}>Player</th>
                  <th className={`pl-2 pr-2 text-center`}>Health</th>
                  <th className={`pl-2 pr-2 text-center`}>Armor</th>
                  <th className={`pl-2 pr-2 text-center`}>Action</th>
                  <th className={`pl-2 pr-2 text-center`}>Card</th>
                </tr>
              </thead>
              <tbody>
              { gameSummary ?
                Object.keys(gameSummary).map((round) => {
                  return (
                    <tr className='text-white' key={round}>
                      <td className={`pl-2 pr-2 text-center`}>{round}</td>
                      { Object.keys(gameSummary[round]).map((player) => {
                          return (
                            <>
                            <td className={`pl-4 pr-4 text-center ${ player === user.name ? 'text-green-600' : 'text-error' }`}>{player}</td>
                            <td className={`pl-2 pr-2 text-center`}>{gameSummary[round][player]["Information"].health}</td>
                            <td className={`pl-2 pr-2 text-center`}>{gameSummary[round][player]["Information"].armor}</td>
                            <td className={`pl-2 pr-2 text-center`}>{gameSummary[round][player]["Actions"] ? gameSummary[round][player]["Actions"].action : '-'}</td>
                            <td className={`pl-2 pr-2 text-center`}>{gameSummary[round][player]["Actions"] ? (gameSummary[round][player]["Actions"].name && gameSummary[round][player]["Actions"].name.length > 0 ? gameSummary[round][player]["Actions"].name : '-') : '-'}</td>
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

    :

    <div className='mt-15 p-4 justify-items-center flex flex-col items-center bg-slate-900 text-white h-full '>
      <div className='p-4 pt-8 justify-items-center flex flex-col items-center h-full'>
      <br></br>
      <br></br>
      <div className='text-xl z-30'>Game Over</div>

      <div className='test-lg z-30'>You Lose. The remnants of your ship are sucked into the void {playGameOverSFX()}</div>

          <table id="summary" className='text-white z-30'>
              <thead>
                <tr>
                  <th className={`pl-2 pr-2 text-center`}>Round</th>
                  <th className={`pl-2 pr-2 text-center`}>Player</th>
                  <th className={`pl-2 pr-2 text-center`}>Health</th>
                  <th className={`pl-2 pr-2 text-center`}>Armor</th>
                  <th className={`pl-2 pr-2 text-center`}>Action</th>
                  <th className={`pl-2 pr-2 text-center`}>Card</th>
                  <th className={`pl-2 pr-2 text-center`}>Player</th>
                  <th className={`pl-2 pr-2 text-center`}>Health</th>
                  <th className={`pl-2 pr-2 text-center`}>Armor</th>
                  <th className={`pl-2 pr-2 text-center`}>Action</th>
                  <th className={`pl-2 pr-2 text-center`}>Card</th>
                </tr>
              </thead>
              <tbody>
              { gameSummary ?
                Object.keys(gameSummary).map((round) => {
                  return (
                    <tr className='text-white' key={round}>
                      <td className={`pl-2 pr-2 text-center`}>{round}</td>
                      { Object.keys(gameSummary[round]).map((player) => {
                          return (
                            <>
                            <td className={`pl-4 pr-4 text-center ${ player === user.name ? 'text-green-600' : 'text-error' }`}>{player}</td>
                            <td className={`pl-2 pr-2 text-center`}>{gameSummary[round][player]["Information"].health}</td>
                            <td className={`pl-2 pr-2 text-center`}>{gameSummary[round][player]["Information"].armor}</td>
                            <td className={`pl-2 pr-2 text-center`}>{gameSummary[round][player]["Actions"] ? gameSummary[round][player]["Actions"].action : '-'}</td>
                            <td className={`pl-2 pr-2 text-center`}>{gameSummary[round][player]["Actions"] ? (gameSummary[round][player]["Actions"].name && gameSummary[round][player]["Actions"].name.length > 0 ? gameSummary[round][player]["Actions"].name : '-') : '-'}</td>
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
    }
  </div>
  )
}