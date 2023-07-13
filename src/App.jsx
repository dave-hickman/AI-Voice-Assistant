import { useState, useEffect } from "react";
import "./App.css";
import Button from "./Components/Button";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    handleListen()
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      }
    else {
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
        .map(result => result[0]).map(result => result.transcript)
        .join("");
      console.log(transcript);
      setNote(transcript)
      mic.onerror = (e) => {
        console.log(e.error);
      };
    };
  };

  return (
    <>
      <h1>Hello</h1>
      <Button isListening={isListening} setIsListening={setIsListening} />
      <p>{note}</p>
    </>
  );
}

export default App;
