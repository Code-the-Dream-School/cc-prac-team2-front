
import React, { useEffect, useState, useContext} from 'react';
import {UserContext} from "../context/user-context"
declare var window: any;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

interface SpeechTextProps {
    setMessageText: (newMessageText: string) => void
}

const SpeechToText = ({setMessageText}:SpeechTextProps ) => {

const {
        user, 
        selectId, 
        setMessages,
    } = useContext(UserContext)

const [isListening, setIsListening] = useState(false)
const [isClick, setIsClick] = useState(false)


const handleClickListen = () => {
  setIsListening(prevState => !prevState)
  setIsClick(true)
}

const handleMouseDown = () => {
    console.log("mouse down");
    
    setIsListening(true);
    mic.start()
    mic.onend = () => {
      mic.start()
  }

  mic.onstart = () => {
    console.log('Mics on')
  }

}

  const handleMouseUp = () => {
    console.log("mouse up");
    setIsListening(false);
    mic.stop()
    mic.onend = () => {
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
  };

  return (
    <>
            <div className="m-auto p-2">
                <button 
                  onMouseDown={handleMouseDown} 
                  onMouseUp={handleMouseUp}
                  >
                  Transcribe
                </button>
            </div>  
    </>
)}

export default SpeechToText