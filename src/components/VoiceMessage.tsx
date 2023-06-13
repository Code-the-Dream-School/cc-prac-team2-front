import React, { useState, useContext } from 'react';
import { toast } from "react-toastify";
import axios from "axios"
import {UserContext} from "../context/user-context"
import Bird from "../assests/Bird.gif"
import Wave1 from "../assests/Wave1.gif"

const VoiceMessage = ({ socket }: { socket: Socket }) => {

    const {
        user, 
        selectId, 
        setMessages,
    } = useContext(UserContext)


    const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const token: {token: string } | null = JSON.parse(localStorage.getItem("token") || "null")

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      // Handle dataavailable event
      recorder.addEventListener('dataavailable', handleDataAvailable);
      
      // Start recording
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaStream) {
    console.log("mouse down");
      mediaRecorder.stop();
      setIsRecording(false);
      mediaStream.getTracks().forEach(track => track.stop());
    }
  };

  const handleDataAvailable = async (event) => {
    
    // Access the recorded audio data (e.g., event.data)
    // Blob {size: 22788, type: 'audio/webm;codecs=opus'}
    // size: 22788
    // type: "audio/webm;codecs=opus"

    const recordedAudio = event.data;
    const formData = new FormData();

    formData.append('audio', recordedAudio);
    formData.append('from', user?.userId,);
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
        sender: user?.userId, 
        _id: message._id,
    }])

    socket.current.emit("sendMessage", {
        createdAt: message.createdAt,
        voiceNote: {
            url: message.voiceNote.url
        }, 
        from: user?.userId, 
        to: selectId,
    })

    } catch (err) {
        console.log(err);
        toast.error("Error sending messages, please try again");
    }
  };


  return (
    <>
    <div className="m-auto p-2">
        <div className='flex flex-row'>
      <button  
        onClick={startRecording} 
        className="bg-slate-300 hover:bg-green-300 w-1/3 rounded-md px-2 mx-2"
        >
        Record
      </button>
      {isRecording ? 
      (
        <>
      <div className="w-1/3">
        <div className='flex items-center justify-center'>
        <img  src={Wave1} alt="Wave" width="30" height="80"/>
        </div>
      </div> 
        <button
            onMouseUp={stopRecording}
            className="bg-slate-300 hover:bg-red-300 w-1/3 rounded-md px-2 mx-2"
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