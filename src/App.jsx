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
  const [gptResponse, setGptResponse] = useState(null);
  const [request, setRequest] = useState({
    model: "gpt-3.5-turbo",
    messages: [],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  useEffect(() => {
    handleListen();
    if (note && !isListening) {
      console.log("im here now");
      setRequest((prevRequest) => {
        const updatedRequest = {
          ...prevRequest,
          messages: [...prevRequest.messages],
        };
        if (!gptResponse) {
          console.log("setting the message");
          updatedRequest.messages.push({ role: "user", content: note });
        } else {
          updatedRequest.messages.push(
            gptResponse,
            { role: "user", content: note }
          );
        }
        return updatedRequest;
      });
      setNote(null)
    }
  }, [isListening]);

  useEffect(() => {
    if (request.messages.length > 0) {
      const apiInteraction = async () => {
        console.log('sending to ai');
        console.log(request);
        const aiResponse = await sendRequest(request);
        console.log('now im here');
        setGptResponse(aiResponse);
        console.log(aiResponse);
      };
      apiInteraction();
    }
  }, [request]);
  

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
      <div className="text-slate-50 text-xs sm:text-base opacity-50 fixed top-2/3 lg:top-2/3 w-80 sm:w-2/3 h-40 text-elipsis m-h-3 ">
        <p className="h-1/2 pr-1 pb-1 overflow-auto">{note}</p>
        <p className="h-1/2 pr-1 pb-1 overflow-auto">{gptResponse?.content}</p>
      </div>
    </main>
  );
}

export default App;
