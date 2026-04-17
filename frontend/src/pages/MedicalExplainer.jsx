

import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiFileText, FiMic } from 'react-icons/fi';
import { aiAPI } from '../utils/api';

export default function MedicalExplainer() {
  const [mode, setMode] = useState('term');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [speakingId, setSpeakingId] = useState(null);
  const [listening, setListening] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🔊 SPEAK
  const speakText = (text, id) => {
    if (!text || !('speechSynthesis' in window)) {
      return toast.error("Speech not supported");
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";

    speech.onend = () => setSpeakingId(null);

    window.speechSynthesis.speak(speech);
    setSpeakingId(id);
  };

  // 🔊 STOP
  const stopSpeak = () => {
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  };

  // 🎤 VOICE INPUT
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return toast.error("Voice not supported");
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
  };

  // 🤖 AI CALL
  const explain = async () => {
    if (loading) return;

    if (!input.trim()) {
      return toast.error('Enter something first');
    }

    const userText = input;
    setInput('');
    setLoading(true);

    // USER MESSAGE
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        role: 'user',
        text: userText
      }
    ]);

    try {
      let res;

      if (mode === 'term') {
        res = await aiAPI.explainTerm(userText);
      } else {
        res = await aiAPI.explainConsent(userText);
      }

      const reply = (res?.explanation || "No response").trim();

      // AI MESSAGE
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          role: 'ai',
          text: reply
        }
      ]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          role: 'ai',
          text: "Something went wrong."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      {/* HEADER */}
      <div className="p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg rounded-b-3xl">
        <h2 className="text-xl font-bold tracking-wide">🧠 AI Medical Assistant</h2>
        <p className="text-xs opacity-80">Smart health explanations, instantly</p>
      </div>

      {/* MODE SWITCH */}
      <div className="flex gap-2 p-3">
        <button
          onClick={() => setMode('term')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
            mode === 'term'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-white text-gray-500 border'
          }`}
        >
          <FiSearch className="inline mr-1" /> Term
        </button>

        <button
          onClick={() => setMode('consent')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
            mode === 'consent'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-white text-gray-500 border'
          }`}
        >
          <FiFileText className="inline mr-1" /> Consent
        </button>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto px-3 space-y-4">

        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10 text-sm">
            💡 Try: “What is fever?”
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-md backdrop-blur-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                  : 'bg-white/80 border border-gray-200 text-gray-800'
              }`}
            >
              <p style={{ whiteSpace: "pre-line" }}>{msg.text}</p>

              {/* SPEAK BUTTON */}
              {msg.role === 'ai' && msg.text && (
                <button
                  onClick={() => {
                    if (speakingId === msg.id) {
                      stopSpeak();
                    } else {
                      speakText(msg.text, msg.id);
                    }
                  }}
                  className="mt-3 text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  {speakingId === msg.id ? "🛑 Stop" : "🔊 Speak"}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="bg-white px-4 py-2 rounded-xl shadow text-sm w-fit animate-pulse">
            🤖 Thinking...
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* INPUT */}
      <div className="p-3 bg-white border-t flex gap-2 items-center shadow-inner">

        <button
          onClick={startListening}
          className={`p-3 rounded-full transition ${
            listening
              ? "bg-red-500 text-white animate-pulse"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <FiMic />
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && explain()}
          placeholder="Ask your health question..."
          className="flex-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <button
          onClick={explain}
          disabled={loading}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow hover:opacity-90 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}