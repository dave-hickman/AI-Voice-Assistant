import { useState, useEffect, useRef } from "react";
import "./App.css";
import Button from "./Components/Button";
import { sendRequest, sendText } from "./utils";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();
mic.continuous = true;
mic.interimResults = true;

const synth = window.speechSynthesis;

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [gptResponse, setGptResponse] = useState(null);
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState([]);
  const [request, setRequest] = useState({
    model: "gpt-3.5-turbo",
    messages: [],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const [speechRequest, setSpeechRequest] = useState({});
  const [audioUrl, setAudioURL] = useState('')
  const [decodedData, setDecodedData] = useState(null)
  const [isThinking, setIsThinking] = useState(false)
  const [audio, setAudio] = useState(null)
  const [audioReady, setAudioReady] = useState(false)

  const spokenRef = useRef(false);

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
          updatedRequest.messages.push(gptResponse, {
            role: "user",
            content: note,
          });
        }
        return updatedRequest;
      });
      setNote(null);
    }
  }, [isListening]);

  useEffect(() => {
    if (request.messages.length > 0) {
      const apiInteraction = async () => {
        setIsThinking(true)
        console.log("sending to ai");
        console.log(request);
        const aiResponse = await sendRequest(request);
        console.log("now im here");
        setGptResponse(aiResponse);
        console.log(aiResponse);
        setSpeechRequest(
          (prevRequest) => (prevRequest.input = { text: aiResponse.content })
        );
        
      };
      apiInteraction();
    }
  }, [request]);

  useEffect(() => {
    const speechInteraction = async () => {
      if (gptResponse) {
        console.log(gptResponse)
        console.log("in speech api function");
        const speechResponse = await sendText({
          input: { text: gptResponse.content },
          voice: { languageCode: "en-GB", name:'en-GB-Neural2-C',
      ssmlGender:'FEMALE' },
          audioConfig: { audioEncoding: "MP3" },
        });
        console.log("now weve got google data back");
        console.log(speechResponse)
        const base64Data = speechResponse.data.response
        console.log('base data atob:', atob(base64Data))
        setDecodedData(atob(base64Data))
        setIsThinking(false)
      }
    };
    speechInteraction();
  }, [gptResponse]);

  useEffect(() => {
    if (decodedData){
      const audioData = 'data:audio/mp3;base64,' + btoa(decodedData)
        const audio = new Audio(audioData)
        setAudio(audio)
        setAudioReady(true)
    }
  },[decodedData])

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
      <Button isListening={isListening} setIsListening={setIsListening} isThinking={isThinking} setDecodedData={setDecodedData} audioReady={audioReady} setAudioReady={setAudioReady} audio={audio}/>
      <div className="text-slate-50 text-base sm:text-base opacity-50 fixed top-3/4 lg:top-3/4 w-80 sm:w-2/3 h-40 text-elipsis m-h-3 ">
        <p className="h-1/2 pr-1 pb-1 overflow-auto">{note}</p>
        {/* <p className="h-1/2 pr-1 pb-1 overflow-auto">{gptResponse?.content}</p> */}
      </div>
    </main>
  );
}

export default App;
