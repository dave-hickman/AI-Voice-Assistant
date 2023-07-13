import { useState, useEffect } from "react";
import "./App.css";
import Button from "./Components/Button";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSpeechRecognitionAvailable = !!SpeechRecognition
const mic = new SpeechRecognition();
mic.continuous = true;
mic.interimResults = true;

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      setNote("");
      mic.start();
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped mic on click");
      };
    }
    mic.onstart = () => {
      console.log("Mics on");
    };

    mic.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log(transcript);
      setNote(transcript);
      mic.onerror = (e) => {
        console.log(e.error);
      };
    };
  };

  if (!isSpeechRecognitionAvailable){
    return(
      <main className="flex w-full min-h-screen flex-col items-center bg-slate-900">
      <header className="fixed top-6">
        <h1 className="text-3xl text-slate-50 font-bold font-RocGrotesk">
          AI VOICE ASSISTANT
        </h1>
      </header>
      <button className="rounded-full bg-teal-100 w-60 h-60 text-slate-700 text-lg z-10 font-RocGrotesk font-medium">Allow Microphone Access</button>
      <div className="text-slate-50 text-sm opacity-50 fixed top-3/4 w-80 h-36 text-elipsis m-h-3">
      <p className="h-full overflow-scroll">{note}</p>
      </div>
    </main>
    )
  } else{

  return (
    <main className="flex w-full min-h-screen flex-col items-center bg-slate-900">
      <header className="fixed top-6">
        <h1 className="text-3xl text-slate-50 font-bold font-RocGrotesk">
          AI VOICE ASSISTANT
        </h1>
      </header>
      <Button isListening={isListening} setIsListening={setIsListening} />
      <div className="text-slate-50 text-sm opacity-50 fixed top-3/4 w-80 h-36 text-elipsis m-h-3">
      <p className="h-full overflow-scroll">{note}</p>
      </div>
    </main>
  );
}}

export default App;
