import React, { FC } from 'react';

type InstructionProps = {
  updateView: Function,
  view: String
  user: Object | null;
  logOut: Function;
  getUser: Function;
};

const Instructions: FC<InstructionProps> = ({getUser, user, view, updateView, logOut }) => {

  return (
    <div className='h-screen bg-slate-500 dark:bg-black dark:text-white text-black text-center'>
      Instructions
    </div>
  )
};

export default Instructions;