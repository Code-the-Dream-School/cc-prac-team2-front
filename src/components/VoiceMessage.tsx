import React, { useState, useContext } from 'react';
import { toast } from "react-toastify";
import axios from "axios"
import {UserContext} from "../context/user-context"

const VoiceMessage = ({ socket }: { socket: Socket }) => {

    const {
        user, setUser, 
        selectId, setSelectId,
        messages, setMessages,
    } = useContext(UserContext)



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
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaStream) {
      mediaRecorder.stop();
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
    {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const {message} = data

    console.log(message)


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
  console.log(messages)


  return (
    <div>
      <button  onClick={startRecording}>Start Recording</button>
      <button  onClick={stopRecording}>Stop Recording</button>

    </div>
  );
};

export default VoiceMessage;
