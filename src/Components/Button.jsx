import { useState, useEffect } from "react";

const Button = ({ isListening, setIsListening }) => {
  const handleClick = () => {
    setIsListening((prevState) => !prevState);
  };

  if (isListening){
  return (
    <span className="relative flex h-60 w-60 top-40">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-30"></span>
      <button
        className="rounded-full bg-red-600 w-60 h-60 text-slate-50 text-lg z-10"
        onClick={handleClick}
      >
        Start/Stop
      </button>
    </span>
  );
  }

  else{
    return (
        <span className="relative flex h-60 w-60 top-40">
          <button
            className="rounded-full bg-teal-100 w-60 h-60 text-slate-700 text-lg z-10 font-RocGrotesk font-medium"
            onClick={handleClick}
          >
            Start/Stop
          </button>
        </span>
      );
  }
};

export default Button;
