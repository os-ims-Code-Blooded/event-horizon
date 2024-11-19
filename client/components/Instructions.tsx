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
    <div className='bg-slate-800 text-white text-center'>
      Instructions
    </div>
  )
};

export default Instructions;