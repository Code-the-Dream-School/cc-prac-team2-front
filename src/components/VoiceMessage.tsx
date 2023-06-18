import React, { useState, useContext } from 'react';
import { toast } from "react-toastify";
import axios from "axios"
import {UserContext} from "../context/user-context"
import Wave from "../assests/Wave.gif"

const VoiceMessage = ({ socket }: { socket: Socket }) => {

    const {
        user, 
        selectId, 
        setMessages,
    } = useContext(UserContext)

  const [isReadyToSend, setIsReadyToSend] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const token: {token: string } | null = JSON.parse(localStorage.getItem("token") || "null")

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      // Handle dataavailable event
      // recorder.addEventListener('dataavailable', handleDataAvailable);
      
      // Start recording
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaStream) {
      mediaRecorder.stop();
      mediaRecorder.addEventListener('dataavailable', (event) => {
        setRecordedAudio(event.data);
      });
      setIsRecording(false);
      setIsReadyToSend(true); // Set the audio ready to be sent
      mediaStream.getTracks().forEach(track => track.stop());
    }
  };

  const sendAudio = async () => {
    
    // Access the recorded audio data (e.g., event.data)
    // Blob {size: 22788, type: 'audio/webm;codecs=opus'}
    // size: 22788
    // type: "audio/webm;codecs=opus"

    if (recordedAudio) {
      const formData = new FormData();

      formData.append('audio', recordedAudio);
      formData.append('from', user?._id,);
      formData.append('to', selectId);
  
      try {
      const {data} = await axios.post('http://localhost:8000/api/v1/messages/voice-note', 
          formData,
          {headers: {
            Authorization: `Bearer ${token}`
          }})
      const {message} = data
      setMessages( prev => [...prev, {
          createdAt: message.createdAt,
          voiceNote: {
              url: message.voiceNote.url
          }, 
          sender: user?._id, 
          _id: message._id,
      }])
  
      socket.current.emit("sendMessage", {
          createdAt: message.createdAt,
          voiceNote: {
              url: message.voiceNote.url
          }, 
          from: user?._id, 
          to: selectId,
      })
      setRecordedAudio(null)
  
      } catch (err) {
          console.log(err);
          toast.error("Error sending messages, please try again");
      }
    }
  };

  const playAudio = () => {
    if(recordedAudio){
        const audioUrl = URL.createObjectURL(recordedAudio)
        const audioElement = new Audio(audioUrl)
        audioElement.play()
    }
  }

  return (
    <>
    <div className="m-auto p-2">
        <div className='flex flex-row'>
      <button  
        onClick={startRecording} 
        className="bg-slate-300 hover:bg-green-300 w-1/5 rounded-md px-2 mx-2"
        >
        Record
      </button>
      {recordedAudio ? (
            <>
              <button  
              onClick={playAudio} 
              className="bg-slate-300 hover:bg-green-300 w-1/5 rounded-md px-2 mx-2"
              disabled={!isReadyToSend}
              >
              Play 
            </button>
            <button  
              onClick={sendAudio} 
              className="bg-slate-300 hover:bg-green-300 w-1/5 rounded-md px-2 mx-2"
              disabled={!isReadyToSend}
              >
              Send 
            </button>
            </>
      ): null }


      {isRecording ? 
      (
        <>
      <div className="w-1/5">
        <div className='flex items-center justify-center'>
        <img  src={Wave} alt="Wave" width="25" height="80"/>
        </div>
      </div> 
        <button
            onClick={stopRecording}
            className="bg-slate-300 hover:bg-red-300 w-1/5 rounded-md px-2 mx-2"
          >
            Stop
        </button>
        </>
        )
      : null }
      </div>
    </div>
    
    </>
  );
};

export default VoiceMessage;
