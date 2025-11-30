// FILE: src/pages/VoiceBot.jsx

import { useState } from "react";
import api from "../config";

export default function VoiceBot() {
  const [reply, setReply] = useState("");

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", blob, "voice.wav");

      const res = await api.post("/bot/voice", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setReply(res.data.reply);
    };

    mediaRecorder.start();

    // Record for 3 seconds
    setTimeout(() => mediaRecorder.stop(), 3000);
  };

  return (
    <div className="flex flex-col items-center p-10">
      <button
        onClick={startRecording}
        className="bg-blue-600 text-white px-6 py-4 rounded-full shadow-md text-xl"
      >
        🎤 Tap to Speak
      </button>

      {reply && (
        <p className="mt-5 bg-white p-4 rounded-md shadow">{reply}</p>
      )}
    </div>
  );
}
