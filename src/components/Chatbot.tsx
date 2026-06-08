"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! I'm Ragnarok, Iota Cluster's AI assistant. Ask me anything about the club!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [statusText, setStatusText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, statusText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    
    // Create chat history WITHOUT the new message yet, as the API expects
    const chatHistory = [...messages].map(m => ({ role: m.role, content: m.content }));
    
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);
    setStatusText("Connecting...");

    try {
      const apiUrl = "https://iotacluster-rag-narok-backend.hf.space";
      const response = await fetch(`${apiUrl}/api/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          chat_history: chatHistory
        })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";
      let buffer = "";

      // Add empty assistant message that will be populated
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.status) {
                setStatusText(data.status);
              }
              if (data.chunk) {
                setStatusText("");
                streamedContent += data.chunk;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content = streamedContent;
                  return newMsgs;
                });
              }
              if (data.error) {
                setStatusText(`Error: ${data.error}`);
              }
            } catch (e) {
              // Ignore partial JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting to my brain right now." }]);
    } finally {
      setIsTyping(false);
      setStatusText("");
    }
  };

  return (
    <div className={styles.chatWidget}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className="flex items-center gap-2">
              <img src="/ragnarok.ico" alt="Ragnarok" className={styles.headerIcon} />
              <span className={styles.chatTitle}>Ragnarok AI</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://rag-narok.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.redirectButton} title="Open Ragnarok Platform">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
              <button onClick={() => setIsOpen(false)} className={styles.closeButton}>&times;</button>
            </div>
          </div>
          
          <div className={styles.chatBody}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                {msg.content}
              </div>
            ))}
            {statusText && (
              <div className={styles.statusIndicator}>
                {statusText}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.chatInputContainer}>
            <form onSubmit={handleSubmit} className={styles.chatForm}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Ragnarok..."
                className={styles.chatInput}
                disabled={isTyping}
              />
              <button type="submit" disabled={isTyping || !input.trim()} className={styles.sendButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className={styles.chatButton}>
          <img src="/ragnarok.ico" alt="Chat" className={styles.chatIcon} />
        </button>
      )}
    </div>
  );
}
