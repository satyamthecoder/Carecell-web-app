//import React, { useState } from 'react';
//import { motion, AnimatePresence } from 'framer-motion';
//import toast from 'react-hot-toast';
//import { FiSearch, FiFileText, FiMic } from 'react-icons/fi';
//import { aiAPI } from '../utils/api';

//const quickTerms = [
  //'Chemotherapy / कीमोथेरेपी', 'Radiotherapy', 'Biopsy / बायोप्सी',
  //'CBC Report', 'Platelets / प्लेटलेट्स', 'Oncologist',
  //'Stage III', 'Metastasis', 'Palliative Care', 'Hemoglobin',
//];

//export default function MedicalExplainer() {
  //const [mode, setMode] = useState('term'); // 'term' or 'consent'
  //const [input, setInput] = useState('');
  //const [result, setResult] = useState(null);
  //const [loading, setLoading] = useState(false);

  //const explain = async (text) => {
    //const q = text || input;
    //i//f (!q.trim()) return toast.error('Please enter a term or text');
    //setLoading(true);
    //setResult(null);
    //try {
      //let res;
      //if (mode === 'term') {
        //res = await aiAPI.explainTerm(q);
      //} else {
        //res = await aiAPI.explainConsent(q);
      //}
      //setResult(res.explanation || res.message);
    //} catch (err) {
      //toast.error('Could not get explanation: ' + err.message);
    //} finally { setLoading(false); }
  //};

  //return (
    //<div className="page-container">
      //<div className="mb-5">
        //<h2 className="section-title">AI Medical Helper</h2>
        //<p className="text-gray-500 text-sm">चिकित्सा शब्दों को आसान भाषा में समझें</p>
      //</div>

      //{/* Mode Toggle */}
      //<div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-2xl">
        //<button onClick={() => setMode('term')}
          //className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${mode === 'term' ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'}`}>
          //<FiSearch size={16} /> Term Explainer
        //</button>
        //<button onClick={() => setMode('consent')}
          //className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${mode === 'consent' ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'}`}>
          //<FiFileText size={16} /> Consent Form
        //</button>
      //</div>

      //{/* Input */}
      //<div className="card mb-4">
        //{mode === 'term' ? (
          //<>
            //<label className="label">Medical Term / चिकित्सा शब्द</label>
            //<div className="relative">
              //<FiSearch className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              //<input
                //value={input}
                //onChange={e => setInput(e.target.value)}
                //onKeyDown={e => e.key === 'Enter' && explain()}
  //              placeholder="e.g. Chemotherapy, RBC, CBC, मतली..."
    //            className="input-field pl-10"
      //        />
        //    </div>
          //  {/* Quick terms */}
 //           <div className="mt-3">
   //           <p className="text-xs text-gray-500 mb-2">Quick search:</p>
     //         <div className="flex flex-wrap gap-2">
       //         {quickTerms.map(t => (
         //         <button key={t} onClick={() => { setInput(t); explain(t); }}
           //         className="px-3 py-1.5 bg-gray-100 hover:bg-brand-50 hover:text-brand-700 text-gray-700 text-xs rounded-xl transition-colors font-medium">
             //       {t}
               //   </button>
          //      ))}
            //  </div>
            //</div>
          //</>
//        ) : (
  //        <>
    //        <label className="label">Paste text from consent form / रिपोर्ट</label>
      //      <textarea
        //      value={input}
          //    onChange={e => setInput(e.target.value)}
            //  placeholder="कोई भी लाइन यहाँ लिखें या पेस्ट करें जो आप समझना चाहते हैं..."
      //        rows={5}
        //      className="input-field resize-none"
          //  />
//          </>
  //      )}
    //    <button onClick={() => explain()} disabled={loading || !input.trim()}
      //    className="btn-primary w-full mt-3 flex items-center justify-center gap-2">
        //  {loading ? (
          //  <>
            //  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              //Explaining...
//            </>
  //        ) : (
    //        <>🤖 Explain / समझाएं</>
      //    )}
//        </button>
  //    </div>
//
  //    {/* Result */}
    //  <AnimatePresence >
      //  {result && (
        //  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          //  <div className="card bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200">
            //  <div className="flex items-center gap-2 mb-3">
              //  <div className="w-8 h-8 gradient-teal rounded-xl flex items-center justify-center text-white text-sm font-bold">AI</div>
                //<p className="font-semibold text-teal-800">CareCell AI का जवाब</p>
//              </div>
  //            <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{result}</div>
    //          <div className="mt-3 pt-3 border-t border-teal-200">
      //          <p className="text-xs text-teal-700 font-medium">
        //          ⚠️ यह सिर्फ समझने के लिए है। अपने डॉक्टर की सलाह जरूर लें।<br />
          //        This is for understanding only. Always follow your doctor's advice.
            //    </p>
              //</div>
            //</div>
          //</motion.div>
        //)}
      //</AnimatePresence>

      //{/* Safety note */}
      //<div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
        //<p className="text-yellow-800 text-sm font-semibold mb-1">ℹ️ Important Note</p>
        //<p className="text-yellow-700 text-xs">This AI helper is for educational understanding only. It does not provide medical advice. Always consult your doctor for treatment decisions.</p>
      //</div>
    //</div>
  //);
//} 







//new code




// new code    for groq ai


import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiFileText, FiVolume2 } from 'react-icons/fi';
import { aiAPI } from '../utils/api';

export default function MedicalExplainer() {
  const [mode, setMode] = useState('term');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🔊 SPEAK FUNCTION
  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "hi-IN"; // change to en-IN if needed
    window.speechSynthesis.speak(speech);
  };

  // ⌨️ TYPING EFFECT FUNCTION
  const typeMessage = (fullText) => {
    let index = 0;

    const interval = setInterval(() => {
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];

        // update last AI message
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...lastMsg,
          text: lastMsg.text + fullText.charAt(index),
        };

        return updated;
      });

      index++;
      if (index >= fullText.length) clearInterval(interval);
    }, 15);
  };

  const explain = async () => {
    if (loading) return;

    if (!input.trim()) {
      return toast.error('Enter something first');
    }

    const userText = input;
    setInput('');
    setLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    try {
      let res;

      if (mode === 'term') {
        res = await aiAPI.explainTerm(userText);
      } else {
        res = await aiAPI.explainConsent(userText);
      }

      const reply = res?.explanation || "No response";

      // Add empty AI message first
      setMessages(prev => [...prev, { role: 'ai', text: '' }]);

      // Start typing effect
      setTimeout(() => {
        typeMessage(reply);
      }, 100);

    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex flex-col h-full">

      {/* Header */}
      <div className="mb-4">
        <h2 className="section-title">AI Medical Chat</h2>
        <p className="text-gray-500 text-sm">
          अब सवाल पूछें जैसे ChatGPT
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-3 bg-gray-100 p-1 rounded-2xl">
        <button
          onClick={() => setMode('term')}
          className={`flex-1 py-2 rounded-xl text-sm ${
            mode === 'term' ? 'bg-white font-semibold' : 'text-gray-500'
          }`}
        >
          <FiSearch size={16} /> Term
        </button>

        <button
          onClick={() => setMode('consent')}
          className={`flex-1 py-2 rounded-xl text-sm ${
            mode === 'consent' ? 'bg-white font-semibold' : 'text-gray-500'
          }`}
        >
          <FiFileText size={16} /> Consent
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 p-2">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center text-sm">
            Ask something like: "What is fever?"
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] text-sm ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {/* Text */}
            <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
              {msg.text}
            </p>

            {/* 🔊 Speak button for AI */}
            {msg.role === 'ai' && msg.text && (
              <button
                onClick={() => speakText(msg.text)}
                className="mt-2 text-xs flex items-center gap-1 text-gray-600 hover:text-black"
              >
                <FiVolume2 /> Speak
              </button>
            )}
          </div>
        ))}

        {loading && (
          <div className="bg-gray-100 p-3 rounded-xl text-sm w-fit">
            AI is typing...
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && explain()}
          placeholder="Ask anything..."
          className="flex-1 input-field"
        />

        <button
          onClick={explain}
          disabled={loading}
          className="btn-primary px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
}