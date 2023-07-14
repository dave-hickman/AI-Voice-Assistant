import { useState, useEffect } from "react";
import "./App.css";
import Button from "./Components/Button";
import getAssistant from "./utils";
import sendRequest from "./utils";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();
mic.continuous = true;
mic.interimResults = true;

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [gptResponse, setGptResponse] = useState(null)
  const [request, setRequest] = useState({
    model: "gpt-3.5-turbo",
  messages: [],
  temperature: 1,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  })

  useEffect(() => {
    handleListen();
    if(note && !isListening){
      setRequest((prevRequest) => {
        if (!gptResponse){
          prevRequest.messages.push({"role": "user", "content": {note}})}
        else {
          prevRequest.messages.push({gptResponse}, {"role": "user", "content": {note}})
        }})
      const apiInteraction = async () => {
        const aiResponse = await sendRequest(request)
      setGptResponse(aiResponse)
      console.log(aiResponse)
      }
      apiInteraction()
    }
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      setNote(null);
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

  return (
    <main className="flex w-full min-h-screen flex-col items-center bg-slate-900">
      <header className="fixed top-10">
        <h1 className="text-3xl text-slate-50 font-bold font-RocGrotesk">
          AI VOICE ASSISTANT
        </h1>
      </header>
      <Button isListening={isListening} setIsListening={setIsListening} />
      <div className="text-slate-50 text-sm sm:text-base opacity-50 fixed top-2/3 lg:top-2/3 w-80 sm:w-2/3 h-40 text-elipsis m-h-3 overflow-hidden">
      <p className="h-full pr-1 pb-1">{note}</p>
      </div>
    </main>
  );
}

export default App;
