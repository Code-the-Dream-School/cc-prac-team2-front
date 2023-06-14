import React, { useEffect, useState} from 'react';
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
            className="bg-slate-300 hover:bg-gray-500 w-1/2 rounded-md"
            onClick={handleClickListen}>
            Start/Stop
        </button>
        {isClick ? (
                isListening ? 
                    (
                      <>
                    <div className="w-1/2">
                      <div className='flex items-center justify-center'>
                      <img  src={Wave} alt="Wave" width="30" height="80"/>
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