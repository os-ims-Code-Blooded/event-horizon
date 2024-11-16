import React from 'react';
import { useState } from 'react';
import MakeGame from './MakeGame';
import Gameplay from './Gameplay';


export default function SelectGame(){

  const [playClicked, setPlayClicked] = useState(false)

  const onClickPlay = () =>{
    setPlayClicked(true)
  }

  const onClickMake = () =>{

  }
return(
<>
{!playClicked ?  (<div className='bg-red-300'>

  <h1>Choose!</h1>
  <button className='bg-lime-200' onClick={onClickPlay}>PLAY NOW!</button>
  <button className='bg-lime-200'>CUSTOMIZE!</button>
</div>) : (<Gameplay/>)}
</>

)

}