import React from 'react';
import '../style.css';
import Gameplay from './game/Gameplay.tsx'

export default function App (){

  return (
    <div>
      <h1 className='bg-slate-600'>Event Horizon</h1>
      <nav className='bg-purple-950'>
        <button className='bg-red-950'>Click me</button>
      </nav>
      <Gameplay />
    </div>
  )
}