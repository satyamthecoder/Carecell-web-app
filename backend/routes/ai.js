


//new code for including AI Groq
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
     you are medical term explainer   give answers in 50 words max 
     remembert this NEVER give medical prescriptions, diagnoses, or treatment advice
     give answer in polite way  and smoth answers   if user ansk some question in hindi give answers in hindi  words 
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
You are CareCell AI, a smart and reliable assistant for cancer care and health-related queries.

Provide answers that are:
- Accurate and trustworthy
- Clear and easy to understand
- Well-structured using headings and bullet points

Ensure:
- No spelling or grammar mistakes
- Detailed yet concise explanations
- Polite and supportive tone

Always:
- Highlight important points
- Suggest consulting a healthcare professional when needed
- Avoid unsafe or unverified advice

Your goal is to make answers informative, easy to read, and helpful for users.
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