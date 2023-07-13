import { useState } from "react";

const Button = ({ isListening, setIsListening }) => {
    const [disabled, setDisabled] = useState(false)
  
  const handleClick = () => {
    if (isListening){
    setIsListening((prevState) => !prevState);
    setDisabled(true);
    setTimeout(() => {
        setDisabled(false)
    }, 4000)}
    else{
        setIsListening((prevState) => !prevState)
    }
  };

  if (isListening){
  return (
    <span className="relative flex h-60 w-60 top-40">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-30"></span>
      <button
        className="rounded-full bg-red-600 w-60 h-60 text-slate-50 text-lg z-10 font-RocGrotesk font-medium"
        onClick={handleClick}
      >
        <p className=" text-xl font-bold">Listening...</p><p className="text-xs">Tap when you've <br></br>finished your question</p>
      </button>
    </span>
  );
  }

  else{
    return (
        <span className="relative flex h-60 w-60 top-40">
          <button
            className="rounded-full bg-teal-100 w-60 h-60 text-slate-700 text-xl z-10 font-RocGrotesk font-medium"
            onClick={handleClick}
            disabled={disabled}
          >
            Start
          </button>
        </span>
      );
  }
};

export default Button;
