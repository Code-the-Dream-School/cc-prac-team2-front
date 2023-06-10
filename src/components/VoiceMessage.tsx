import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import Recorder from 'recorder-js';

const VoiceMessage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    const initRecorder = async () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const newRecorder = new Recorder(audioContext, { numChannels: 1 });
      newRecorder.init(stream);

      setRecorder(newRecorder);
    };

    initRecorder();
  }, []);

  const handleRecord = () => {
    if (!recorder) return;

    if (!isRecording) {
      recorder.start();
      setIsRecording(true);
    } else {
      recorder.stop();
      setIsRecording(false);

      recorder.exportWAV((blob) => {
        saveAs(blob, 'recording.wav');
      });

      recorder.clear();
    }
  };

  return (
    <>
      <button onClick={handleRecord}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </>
  );
};

export default VoiceMessage;
