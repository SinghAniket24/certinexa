import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import "./Chatbot.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        "Hi 👋 I’m CertiNexa Assistant.\n\nYou can ask me about:\n• Platform overview\n• Certificate security\n• Verification process"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "What is CertiNexa?",
    "How does certificate verification work?",
    "Is CertiNexa secure?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text ?? input;
    if (!userText.trim() || loading) return;

    setInput("");

    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chatbot/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userText })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            data.answer ||
            "I can help only with CertiNexa features, security, and verification."
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Server error. Please try again later." }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="chatbot-fab" onClick={() => setOpen(!open)}>
        <FaRobot />
      </div>

      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>CertiNexa Assistant</span>
            <FaTimes onClick={() => setOpen(false)} />
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-message ${msg.from}`}>
                {msg.text}
              </div>
            ))}

            {/* Quick Questions (only when few messages) */}
            {messages.length <= 2 && (
              <div className="quick-questions">
                {quickQuestions.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="chatbot-message bot typing">
                CertiNexa Assistant is typing…
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask about certificates, security, verification…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={() => sendMessage()} disabled={loading}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
