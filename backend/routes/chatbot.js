const express = require("express");
const router = express.Router();
const axios = require("axios");

const { certiNexaKnowledge } = require("../models/certinexa_knowledge");

// POST /api/chatbot/ask
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

const prompt = `
You are CertiNexa Assistant, a helpful chatbot for the CertiNexa platform.

INSTRUCTIONS:
- Answer ONLY in simple, easy words.
- Always reply in clear bullet points.
- Keep answers short and to the point.
- Use friendly and professional tone.
- You MAY rephrase and simplify the information.
- Answer common questions like:
  • what is CertiNexa
  • what features it has
  • how verification works
  • is it safe and secure
- Use ONLY the information given in the context.
- If a question is outside the context, say:
  "I can only answer questions related to CertiNexa usage, security, and verification."


CONTEXT:
${certiNexaKnowledge}

USER QUESTION:
"${question}"

ANSWER:
`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        timeout: 15000, // safety timeout
      }
    );

    const answer =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    res.json({
      success: true,
      answer: answer || "I’m here to help with CertiNexa-related questions.",
    });
  } catch (error) {
    console.error(
      "Chatbot error details:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Chatbot service unavailable",
    });
  }
});

module.exports = router;
