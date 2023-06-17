import { useEffect, useState} from 'react';
import Wave from "../assests/Wave.gif"
declare var window: any;


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

interface SpeechTextProps {
    setMessageText: (newMessageText: string) => void
}

export default function SpeechToText({setMessageText}:SpeechTextProps ) {
const [isListening, setIsListening] = useState(false)
const [isClick, setIsClick] = useState(false)


useEffect(() => {
  handleListen()
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [isListening])

const handleClickListen = () => {
  setIsListening(prevState => !prevState)
  setIsClick(true)
}

const handleListen = () => {

  if (isListening) {
    mic.start()
    mic.onend = () => {
      mic.start()
    }
  } else {
    mic.stop()
    mic.onend = () => {
    }
  }
  mic.onstart = () => {
    console.log('Mics on')
  }

  mic.onresult = (event: any) => {
    const transcript = Array.from(event.results as Array<{ [key: string]: any}>)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')
      setMessageText(transcript)
    mic.onerror = (event: any) => {
      console.log(event.error)
    }
  }
}


  return (
    <>
        <div className="m-auto p-2">
        <div className='flex flex-row'>
        <button 
            className={`bg-slate-300 hover:bg-green-300 w-1/2 px-2 mx-2 rounded-md ${isListening ? "hover:bg-red-300" : ""}`}
            onClick={handleClickListen}>
              {isListening ? "Stop" : "Transcribe"}
        </button>
        {isClick ? (
                isListening ? 
                    (
                      <>
                    <div className="w-1/2">
                      <div className='flex items-center justify-center'>
                      <img  src={Wave} alt="Wave" width="25" height="80"/>
                      </div>
                    </div> 
                      </>
                      )
                    : null 
                    )  
        : null }
          </div>
        </div>

    </>
)}
