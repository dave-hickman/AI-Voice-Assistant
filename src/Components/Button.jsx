import { useState, useEffect } from "react";

const Button = ({ isListening, setIsListening }) => {
  const handleClick = () => {
    setIsListening((prevState) => !prevState);
  };

  return <button onClick={handleClick}>Start/Stop</button>;
};

export default Button;
