import React, { FC } from 'react';

type InstructionProps = {
  user: Object | null;
};

const Instructions: FC<InstructionProps> = ({user }) => {

  return (
    <div className='h-screen bg-slate-800 dark:bg-black dark:text-slate-200 text-white text-center sm:grid-cols-1 md:grid-cols-2 '>
      <div className='justify-center flex-cols space-between'>
        <h2 className='pt-10 font-extrabold text-4xl'>INSTRUCTIONS</h2>
        <div className='border-white p-3'>BASICS</div>
        <div className='border-white p-3'>ROUNDS</div>
        <div className='border-white p-3'>GOAL</div>
      </div>
    </div>
  )
};

export default Instructions;