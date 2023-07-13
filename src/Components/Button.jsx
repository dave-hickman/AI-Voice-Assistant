import { useState, useEffect } from "react";

const Button = ({ isListening, setIsListening }) => {
  const handleClick = () => {
    setIsListening((prevState) => !prevState);
  };

  return <button className="rounded-full bg-orange-600 w-60 h-60 text-slate-50 text-lg" onClick={handleClick}>Start/Stop</button>;
};

export default Button;
