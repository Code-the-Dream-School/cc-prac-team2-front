import { useState, useContext, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { FaMicrophone, FaStop, FaPlay, FaPaperPlane } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./VoiceMessage.css";
import RecordRTC from "recordrtc";
import ReactPlayer from 'react-player'

interface VoiceMessageProps {
  socket: Socket,
  onHandleTranslateText: (newMessageText: string) => void;
}

const VoiceMessage = ({ socket, onHandleTranslateText }: VoiceMessageProps) => {
  

  const WHISPER_TRANSCRIPTION_URL = "https://api.openai.com/v1/audio/translations"
  const { user, selectId, setMessages } = useContext(UserContext);
  const [isReadyToSend, setIsReadyToSend] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioData, setAudioData] = useState(null);
  const audioRef = useRef(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const token: { token: string } | null = JSON.parse(
    localStorage.getItem("token") || "null"
  );

  const startRecording = () => {
    setIsRecording(true)
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const options = {
        type: 'audio',
        mimeType: 'audio/mp3',
        numberOfAudioChannels: 1,
        recorderType: RecordRTC.StereoAudioRecorder,
        // checkForInactiveTracks: true,
        // timeSlice: 5000,
        // ondataavailable: (blob) => {
        //   socket.emit('audio', { buffer: blob })
        // },
      }

      const recordRTC = new RecordRTC(stream, options)
      setRecorder(recordRTC)
      recordRTC.startRecording()
    })
  }



  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(async () => {
        let blob = await recorder.getBlob();
        console.log(blob);
        
        var file = new File([blob], 'filename.mp3', {
          type: 'audio/mp3'
      }
      );
  
        console.log(file)
        setRecordedAudio(file);
        setIsRecording(false);
        setIsReadyToSend(true); // Set the audio ready to be sent
    }
    );
    }
}



  //   if (mediaRecorder && mediaStream) {
  //     mediaRecorder.stop();
  //     mediaRecorder.addEventListener("dataavailable", (event) => {
  //       setRecordedAudio(event.data);
  //     });
  //     setIsRecording(false);
  //     setIsReadyToSend(true); // Set the audio ready to be sent
  //     mediaStream.getTracks().forEach((track) => track.stop());
  //   }
  // };



  const sendAudio = async () => {
    if (recordedAudio) {
      const formData = new FormData();

      formData.append("audio", recordedAudio);
      formData.append("from", user?._id);
      formData.append("to", selectId);

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_VOICE_MESSAGES_URL}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(data)
        const { message } = data;
        setMessages((prev) => [
          ...prev,
          {
            createdAt: message.createdAt,
            voiceNote: {
              url: message.voiceNote.url,
            },
            sender: user?._id,
            _id: message._id,
          },
        ]);

        socket.current.emit("sendMessage", {
          createdAt: message.createdAt,
          voiceNote: {
            url: message.voiceNote.url,
          },
          from: user?._id,
          to: selectId,
        });
        setRecordedAudio(null);
      } catch (err) {
        toast.error("Error sending messages, please try again");
      }
    }
  };

  const playAudio = () => {
    if (recordedAudio) {
      const audioUrl = URL.createObjectURL(recordedAudio);
      const audioElement = new Audio(audioUrl);
      audioElement.play();
    }
  };

  const removeAudio = () => {
    setRecordedAudio(null);
  };

  const handleTranslateAudio = async () => {

    const formData = new FormData()

    if(recordedAudio) {
      formData.append("file", recordedAudio)
      formData.append("model", "whisper-1")
      formData.append("language", "en")
      if(recordedAudio.size > 25 * 1024 * 1024) {
        alert("Please upload an audio file less than 25MB")
        return
    }
    }

    try {
      const response = await fetch(WHISPER_TRANSCRIPTION_URL, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
          method: "POST",
          body: formData
      })
      const data = await response.json()
      onHandleTranslateText(data)
     
  } catch (err) {
      console.log(err);
  } finally {
  }
 
  }


  // const createAudioData = () => {
  //   const duration = 10; // Duration in seconds
  //   const sampleRate = 44100; // Sample rate in Hz
  //   const numChannels = 1; // Mono
  //   const numSamples = sampleRate * duration;
  //   const audioDataArray = new Uint8Array(numSamples);
  
  //   // Generate a simple sine wave
  //   for (let i = 0; i < numSamples; i++) {
  //     const t = i / sampleRate;
  //     const frequency = 440; // Hz
  //     const sample = Math.sin(2 * Math.PI * frequency * t) * 127 + 128;
  //     audioDataArray[i] = sample;
  //   }
  
  //   return audioDataArray;
  // };
  

  // console.log(audioData);

  // {data: Uint8Array(960000), size: 960000, type: 'audio/wav'}
  // {
  //   data: Uint8Array(10187) [
  //      73,  68,  51,   4,   0,  0,   0,   0,   0,  25,  84,  83,
  //      83,  69,   0,   0,   0, 15,   0,   0,   3,  76,  97, 118,
  //     102,  53,  52,  46,  50, 49,  46,  49,  48,  48,   0, 239,
  //     191, 189, 239, 191, 189, 56, 239, 191, 189,   0,   0,   0,
  //       0,   0,   0,   0,   0,  0,  73, 110, 102, 111,   0,   0,
  //       0,   7,   0,   0,   0, 68,   0,   0,  19, 239, 191, 189,
  //       0,  14,  18,  21,  21, 25,  28,  28,  32,  36,  36,  39,
  //      43,  43,  46,  50,  50, 54,  57,  57,  61,  64,  64,  68,
  //      72,  75,  75,  79,
  //     ... 10087 more items
  //   ],
  //   size: 10187,
  //   type: 'audio/mp3'
  // }
  




  // useEffect(() => {
  //   const audioDataRaw = createAudioData();
  //   const blob = new Blob([audioDataRaw], { type: 'audio/mp3' });
  //   const fileAudio = new File([blob], 'fileAudio.mp3', {
  //     type: 'audio/mp3'
  //   })
  //   const url = URL.createObjectURL(fileAudio);
  //   console.log(fileAudio);
  //   var audio0 = new Audio(url);
   
  //   if (audioRef.current) {
  //     audioRef.current.src = url
  //   }
  //   console.log(audio0);
  //   setAudioURL(url);
  // }, []);

  useEffect(() => {
    const fetchAudio = async () => {
      try { 
        const {data} = await axios.get("http://localhost:8000/api/v1/test", 
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        })
        console.log(data)
        const decodedAudioData = atob("SUQzBAAAAAAAGVRTU0UAAAAPAAADTGF2ZjU0LjIxLjEwMAD/4zjAAAAAAAAAAAAASW5mbwAAAAcAAABEAAAT+AAOEhUVGRwcICQkJysrLjIyNjk5PUBAREhLS09SUlZaWl1hYWRoaGxvb3N2dnp+foGFiYmMkJCTl5ebnp6ipaWpra2wtLS3u7u/wsbGyc3N0dTU2Nvb3+Pj5urq7fHx9fj4/P9MYXZmNTQuMjEuMTAwAAAAAAAAAAAkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4xjEAAAAA0gAAAAAWACvABBOBvAgAGSgIFw////VLvh9QYlJd8PqDDxA4Th5YfKAg8QOB9XzfJsN7OHCr5eIhOggQAsMLif/4xjEOwoQIWmRQxgA5uKXShYgDjya/536AQgQ/6jn/wdYC//////////0daoxo2///9+hmCYlxQlxpmuMYtCPEW5Cc2xj1zv/4xjETQxIyqwBlCgA7ApVM5Qdf//3jpx/FNb0YRA2Dgkb/jhEXDVv88oNlN/3Gg+QJGo31JjQaHp/HyYiMPv9DBwg3ic56z//4xjEVhcqPsgBzzgA858p9Z/xBff/Gk1vqlMB6Oe6aaFOo0L5gBFmiKf1IsAEd/4pBy3/jw1b4NfKu+d+lvyoCe7iJ/Fg16D/4xjENA9BBtDIg05I87qJP8K/JfUT98YPaC/qZx9VtFhQ/IJ6W45b7hVeJrwQeV1dc5bmkwBCL/84SHesP/b//////ir/id3/4xjEMg0Q1szIbg4o6gQVkkckkAAkCL/0IoHQchKe3QNg7AtAmBKGp+OgtBglnnv/josGOsyA////////8TPu9oGJgNQpH6X/4xjEOA3w2wpYU04qG/Tf9ZsVCeAZQCgEeIOaLouxfHESQWFBYyO4wQV+pZdPGyRzrWEm/iv////////86es539RUV2llMDX/4xjEOw04usQBUQAA7XIv/1mQGBWHAR59jBMgHkse3DUOzIUHgeVv8g4nlOOmjXIuMHMLJHgrnEBQFZ8aP6bG/dtr+nRvT0//4xjEQRhSvqwBmSgA+vdCE+XzCJEcn/PL6+nj71/8UY7D8uPD5n9Z1l3rl0qqS/+kF/K5fotPoD1BD3+R2NOaKMH2M6hwAaz/4xjEGhJiSswBjzgAlqkaNGbyoA5DQVjbzV8f9bHdd///////++fvmHPYVmf7HPEg86w76g7//Lljv+Hqn/76w9jdhAf8C9L/4xjECw5YzsDJjTgC4bmqa1rSSQiTJPsggOMhJGdDuyu2KwcM/2VXot/16P+2fqFR7CIlLf9X//s/bRXyfjuvnklwfP954rn/4xjEDA+iMtQBilAAeQC5/V/JpkgEKyH/6hdl+a4GySyDNH//Xz30JVyD//7HtYjd8842ePxVJToR/p////jFI9ay2omn84H/4xjECA5hyswBjVAAsOxwOFVZrrEkJVceStXEAJJaYEs47OX8L5aisTUX//oPWzzcxP//6bkp0q7/////qqU0yewmLh8DG/T/4xjECQ9joqwBhRAAD4cFT1+Lxouv/2IxCN3//q87uT///OMd1yH/////yZG////9ToCEaNU5P/////95ynOICEUUkW+pSlD/4xjEBg3g3rwBzRAA9gJmD4JkXyVWxyigcHaNYAYgDWEZQVZfqJg1mX/wh35d/wP+r8/9LP3/mT3///9pmVWSRySSDbq/dcz/4xjECQypWwJAg8ROQQYuNdK28+1vptC+MiJqa2tf+18HUoJjs37hg4G7f0UQdXP+jmc6CG9CF3/q4VJf9RgCB4ARVv2UTD7/4xjEEQ0hhtgAOUxwFBYr9GOHw+OAcCDy+hCQQQJhq//j/8+lDpb/60Rh6YZ1AgGaGzf6jcCAarRPPFgOh430uYJhWRmt+QX/4xjEFwzhgtQAOcRMAImpnb0OKCgICJM/qjlKFAXL9FMYxgxiUqIruZqtRy2gC2UAMbn39I6eFp3/e8z5YXPo9yvnjUHxXb//4xjEHgygpv5YOZImod9v/////Fv9DGHyfxB8o7/0DT6aDZ/+4go/mb1x7eleHsAHwGxoc0qrv9Apmv0nf/////////oRUKj/4xjEJg0YosAAU+IkCAri4EFhY3BAmKsAoaMVDv/YKMC6LUOp1UB2gFYSBlMkvVYeT/Cz/R////////9X5QWe3EAsIgaxQIn/4xjELAsgmsAAU1oklY5FJAABJBgmQQbTMzQ6IGDUjU9HPJAp4VVH115mI0bfK///////9cLs8i7xE/4K//ERJTYERt7mOxL/4xjEOgygnv5ZTRACez+ewjnPr0EoYEtmuhL3Zcn337HXW32+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4xjEhwAAA0gAAAAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqr/4xjEwgAAA0gAAAAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqr/4xjExAAAA0gAAAAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqr/4xjExAAAA0gAAAAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqr/4xjExAAAA0gAAAAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqr/4xjExAAAA0gAAAAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/4xjExAAAA0gAAAAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/4xjExAAAA0gAAAAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/4xjExAAAA0gAAAAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=");
        const uint8Array = new Uint8Array(decodedAudioData.length);
        for (let i = 0; i < decodedAudioData.length; i++) {
          uint8Array[i] = decodedAudioData.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        console.log(url)
        setAudioURL(url)
      } catch (err) {
        console.log(err);
      }
    }
    fetchAudio()

  }, [])
  

  console.log(audioURL)

  const handlePlay = () => {
    console.log("click");
    
    if(audioURL){
      const tmp = new Audio(audioURL); //passing your state (hook)
      tmp.play() //simple play of an audio element. 
    }

  }

  
  
  

  return (
    <>
      <div className="">
        <div className="flex flex-row gap-10">
          <button
            onClick={startRecording}
            className="bg-slate-300 hover:bg-slate-400  rounded-full px-2.5 h-9 w-9 items-center justify-center"
          >
            <FaMicrophone />
          </button>
          {recordedAudio ? (
            <>
              <button
                onClick={playAudio}
                className="bg-slate-300 hover:bg-slate-400 rounded-full h-9 px-2.5"
                disabled={!isReadyToSend}
              >
                <FaPlay />
              </button>
              <button
                onClick={removeAudio}
                className="bg-slate-300 hover:bg-red-300 rounded-full h-9 px-2.5"
                disabled={!isReadyToSend}
              >
                <MdDelete />
              </button>
              <button
                onClick={sendAudio}
                className="bg-slate-300 hover:bg-green-300 rounded-full h-9 px-2.5"
                disabled={!isReadyToSend}
              >
                <FaPaperPlane />
              </button>
              <button
                onClick={handleTranslateAudio}
                className="bg-slate-300 hover:bg-green-300 rounded-full h-9 px-2.5"
                disabled={!isReadyToSend}
              >
                Translate
              </button>
            </>
          ) : null}

          {isRecording ? (
            <>
              <div className="w-1/5">
                <div className="flex items-center justify-center">
                  <div id="bars">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                  </div>
                </div>
              </div>
              <button
                onClick={stopRecording}
                className="bg-slate-300 hover:bg-red-300 rounded-md h-9 px-2.5"
              >
                <FaStop />
              </button>
            </>
          ) : null}
        </div>
      </div>
      <div>
      {audioURL && (
        <audio ref={audioRef} controls>
          <source src={audioURL} type="audio/mp3" />
        </audio>
      )}
    </div>
    <button onClick={handlePlay}>
        Click
    </button>
    </>
  );
};

export default VoiceMessage;