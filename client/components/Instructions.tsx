import React, { FC } from 'react';

type InstructionProps = {
  user: Object | null;
};

const Instructions: FC<InstructionProps> = ({user }) => {

  return (
    <div
      className="h-screen bg-radial-custom dark:text-slate-200 text-white text-center sm:grid-cols-1 md:grid-cols-2"
      aria-label="Instructions Page"
    >
      <div
        className="justify-center flex-cols space-between"
        aria-labelledby="instructions-heading"
      >
        <h2
          id="instructions-heading"
          className="pt-20 font-extrabold text-4xl"
          aria-label="Instructions Heading"
        >
          INSTRUCTIONS
        </h2>
        <div className="border-white p-3" aria-label="Instructions Basics Section">
          BASICS
        </div>
        <div className="border-white p-3" aria-label="Instructions Rounds Section">
          ROUNDS
        </div>
        <div className="border-white p-3" aria-label="Instructions Goal Section">
          GOAL
        </div>
      </div>
    </div>
  );
};

export default Instructions;