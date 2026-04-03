//const express = require('express');
//const router = express.Router();
//const { protect } = require('../middleware/auth');

// @POST /api/ai/explain-term
//router.post('/explain-term', protect, async (req, res) => {
  //try {
   // const { term, language = 'hindi' } = req.body;
  //  if (!term) return res.status(400).json({ success: false, message: 'Term is required' });
//
 //   const prompt = `You are CareCell AI, a medical assistant for cancer patients in India. 
//A patient asks: "${term}"

//Rules:
//- Explain in SIMPLE Hindi first, then simple English
//- Never give treatment advice or medication recommendations
//- Keep it short: 2-3 sentences max
//- If asked "should I stop/take medicine", reply: "यह निर्णय आपके डॉक्टर करेंगे। Please discuss with your oncologist."
//- Format: Hindi explanation first, then English translation
//- Use very simple words that an uneducated person can understand

//Respond ONLY with the explanation, no extra formatting.`;
//
    //const apiKey = process.env.ANTHROPIC_API_KEY;
    //if (!apiKey) {
      // Fallback mock responses
      //const mockResponses = {
      //  chemotherapy: 'कीमोथेरेपी एक दवाई का इलाज है जो कैंसर की कोशिकाओं को मारती है। इसे नसों में या मुंह से दिया जाता है।\n\nChemotherapy is a drug treatment that kills cancer cells. It is given through a vein (IV) or by mouth.',
     //   rbc: 'RBC यानी लाल रक्त कोशिकाएं - ये खून में ऑक्सीजन पहुंचाती हैं। इनकी कमी से थकान और कमजोरी होती है।\n\nRBC means Red Blood Cells - they carry oxygen in the blood. Low RBC causes fatigue and weakness.',
       // default: `"${term}" एक चिकित्सा शब्द है। इसके बारे में अपने डॉक्टर से विस्तार में पूछें।\n\n"${term}" is a medical term. Please ask your doctor for a detailed explanation in your context.`
     // };
   //   const key = Object.keys(mockResponses).find(k => term.toLowerCase().includes(k));
    //  return res.json({ success: true, explanation: mockResponses[key] || mockResponses.default, demo: true });
  //  }
//
   // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //  method: 'POST',
     // headers: {
     //   'Content-Type': 'application/json',
   //     'x-api-key': apiKey,
     //   'anthropic-version': '2023-06-01'
   //   },
 //     body: JSON.stringify({
    //    model: 'claude-sonnet-4-20250514',
  //      max_tokens: 300,
      //  messages: [{ role: 'user', content: prompt }]
    //  })
  //  });
//
   // const data = await response.json();
    //if (!response.ok) throw new Error(data.error?.message || 'AI API error');

   // const explanation = data.content[0]?.text || 'Unable to explain at this time.';
 //   res.json({ success: true, explanation });
  //} catch (error) {
//    res.status(500).json({ success: false, message: error.message });
  //}
//});

// @POST /api/ai/explain-consent
//router.post('/explain-consent', protect, async (req, res) => {
//  try {
//    const { text } = req.body;
  //  if (!text) return res.status(400).json({ success: false, message: 'Text is required' });
//
 //   const prompt = `You are CareCell AI, helping Indian cancer patients understand medical/consent form text.
//
//The patient has pasted this text from a consent form or medical report:
//"${text}"
//
//Task:
//1. Rewrite this in SIMPLE Hindi (सरल हिंदी) in 2-3 sentences
//2. Then write it in simple English in 2-3 sentences
//3. At the end add: "⚠️ यह सिर्फ समझने के लिए है। अपने डॉक्टर की सलाह मानें। | This is for understanding only. Follow your doctor's advice."

//Use simple words. Avoid medical jargon. Be direct and clear.`;

   // const apiKey = process.env.ANTHROPIC_API_KEY;
   // if (!apiKey) {
     // return res.json({
     //   success: true,
      //  explanation: `सरल हिंदी में: यह फॉर्म आपकी सहमति के लिए है। इसमें लिखे इलाज के लिए आप राजी हैं, यह बताता है।\n\nIn simple English: This form confirms your agreement to the mentioned medical procedure or treatment.\n\n⚠️ यह सिर्फ समझने के लिए है। अपने डॉक्टर की सलाह मानें। | This is for understanding only. Follow your doctor's advice.`,
    //    demo: true
  //    });
//    }

   // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //  method: 'POST',
  //    headers: {
     ///   'Content-Type': 'application/json',
   //     'x-api-key': apiKey,
       // 'anthropic-version': '2023-06-01'
     // },
     // body: JSON.stringify({
   //     model: 'claude-sonnet-4-20250514',
 //       max_tokens: 400,
       // messages: [{ role: 'user', content: prompt }]
     // })
   // });

    //const data = await response.json();
    //if (!response.ok) throw new Error(data.error?.message || 'AI API error');

    //res.json({ success: true, explanation: data.content[0]?.text });
  //} catch (error) {
    //res.status(500).json({ success: false, message: error.message });
  //}
//});

// @POST /api/ai/buddy-assessment
//router.post('/buddy-assessment', protect, async (req, res) => {
 // try {
  //  const { checkinData } = req.body;
//
  //  const prompt = `You are CareCell Cancer Buddy AI for Indian patients.
//
//Patient's daily check-in:
//- Wellbeing score: ${checkinData.wellbeing}/5
//- Fever: ${checkinData.symptoms?.fever?.present ? `Yes (${checkinData.symptoms.fever.severity})` : 'No'}
//- Pain: ${checkinData.symptoms?.pain?.present ? `Yes (${checkinData.symptoms.pain.severity})` : 'No'}
//- Bleeding: ${checkinData.symptoms?.bleeding?.present ? 'Yes' : 'No'}
//- Vomiting: ${checkinData.symptoms?.vomiting?.present ? 'Yes' : 'No'}
//- Confusion: ${checkinData.symptoms?.confusion?.present ? 'Yes' : 'No'}
//- Notes: ${checkinData.notes || 'None'}

//Give a SHORT compassionate response in Hindi + English:
//1. Acknowledge their feelings (1 sentence)
//2. Your assessment (1-2 sentences)
//3. One practical tip for today
//4. If critical symptoms: clearly say "अभी अस्पताल जाएं | Go to hospital NOW"

//Keep total under 100 words.`;

   // const apiKey = process.env.ANTHROPIC_API_KEY;
 //   if (!apiKey) {
   //   const score = checkinData.wellbeing;
 //     const msgs = {
      //  5: 'बहुत अच्छा! आप अच्छा महसूस कर रहे हैं। | Great! You are feeling well. आज खूब पानी पिएं और हल्का भोजन करें।',
        //3: 'थोड़ा मुश्किल दिन है। | Having a tough day. आराम करें, तरल पदार्थ लें। अगर बुखार बढ़े तो डॉक्टर को बताएं।',
        //1: '⚠️ आप ठीक नहीं लग रहे। | You do not seem well. कृपया तुरंत अपने डॉक्टर से संपर्क करें। | Please contact your doctor immediately.'
      //};
    //  return res.json({ success: true, message: msgs[score] || msgs[3], demo: true });
  //  }
//
  //  const response = await fetch('https://api.anthropic.com/v1/messages', {
  //    method: 'POST',
//      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      //body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 200, messages: [{ role: 'user', content: prompt }] })
    //});

    //const data = await response.json();
    //res.json({ success: true, message: data.content[0]?.text });
  //} catch (error) {
  //  res.status(500).json({ success: false, message: error.message });
  //}
//});

//module.exports = router;


//new code for including AI gemini 
const express = require("express");
const Groq = require("groq-sdk");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🔥 Helper function
const getGroqExplanation = async (systemPrompt, userContent) => {
  return await groq.chat.completions.create({
    model: "llama-3.1-8b-instant", // ✅ FINAL STABLE MODEL
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    temperature: 0.5,
  });
};

// 👉 Explain medical term
router.post("/explain-term", async (req, res) => {
  try {
    const { term } = req.body;

    if (!term || term.trim() === "") {
      return res.status(400).json({ message: "Term is required" });
    }

    const systemPrompt = `
You are a medical assistant.

Explain clearly in Hindi and English.

Rules:
- Use simple sentences
- Do NOT use ** or markdown
- Use clean headings
- Format like this:

1. What is it:
2. Causes:
3. Symptoms:
4. What to do:

keep it clean and readable 
`;

    const completion = await getGroqExplanation(
      systemPrompt,
      `Explain this: ${term}`
    );

    res.json({
      explanation: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("GROQ_ERROR:", error.message);
    res.status(500).json({
      message: "AI failed. Try again.",
    });
  }
});

// 👉 Explain consent / report
router.post("/explain-consent", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Text is required" });
    }

    const systemPrompt = `
You are a medical assistant.

Explain this medical text simply:
- Use bullet points
- English + Hindi
`;

    const completion = await getGroqExplanation(systemPrompt, text);

    res.json({
      explanation: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("GROQ_ERROR:", error.message);
    res.status(500).json({
      message: "AI failed. Try again.",
    });
  }
});

module.exports = router;