import { useEffect, useMemo, useRef, useState } from "react";

const starterChips = [
  { label: "Summarize AI headlines", prompt: "Summarize the latest AI headlines." },
  { label: "Make a weekly workout plan", prompt: "Plan a 7-day workout routine for beginners." },
  { label: "Explain tool-calling simply", prompt: "Explain tool-calling in simple words." },
  { label: "Write a launch announcement", prompt: "Draft a clean launch announcement post." },
];

const cannedReplies = [
  "That is a strong question. I would start with a short summary, then verify with a reliable source.",
  "Here is a practical approach:\n1. Define the goal clearly.\n2. Break it into steps.\n3. Execute and iterate.",
  "I can help with that. If you share a little more context, I can make the answer much more precise.",
  "For now this is a static frontend, so this response is simulated. Backend integration can be wired next.",
];

function TypingDots() {
  return (
    <div className="typing-dots" aria-label="Assistant is typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

function Message({ message }) {
  return (
    <article className={`message ${message.role}`}>
      {message.role === "assistant" && <div className="avatar">M</div>}
      <div className="bubble">{message.typing ? <TypingDots /> : message.text}</div>
    </article>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Welcome to Mustafa GPT. Send a message below to preview the chat behavior.",
      typing: false,
    },
  ]);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const currentReply = useMemo(() => {
    const index = Math.floor(Math.random() * cannedReplies.length);
    return cannedReplies[index];
  }, [messages.length]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    scrollElement.scrollTo({ top: scrollElement.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
  }, [input]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (window.innerWidth > 1024) return;
      const sidebar = document.querySelector("#sidebar");
      const menuButton = document.querySelector("#menuBtn");

      if (!sidebar || !menuButton) return;
      if (sidebar.contains(event.target) || menuButton.contains(event.target)) return;

      setSidebarOpen(false);
    };

    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const submitPrompt = (promptText) => {
    const text = promptText.trim();
    if (!text) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      typing: false,
    };

    const typingMessageId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: typingMessageId,
        role: "assistant",
        text: "",
        typing: true,
      },
    ]);

    setInput("");

    window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === typingMessageId
            ? {
                ...message,
                typing: false,
                text: currentReply,
              }
            : message
        )
      );
    }, 650);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitPrompt(input);
  };

  const startNewChat = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Fresh chat started. What do you want to explore next?",
        typing: false,
      },
    ]);

    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <div className="page-glow page-glow-left"></div>
      <div className="page-glow page-glow-right"></div>

      <div className="app-shell">
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} id="sidebar">
          <div className="sidebar-top">
            <button className="new-chat-btn" type="button" id="newChatBtn" onClick={startNewChat}>
              <span className="new-chat-icon">+</span>
              <span>New chat</span>
            </button>

            <div className="chat-history">
              <p className="history-label">Recent</p>
              <button className="history-item active" type="button">
                Launch dates and tech news
              </button>
              <button className="history-item" type="button">
                Travel ideas for summer
              </button>
              <button className="history-item" type="button">
                Meal prep for one week
              </button>
            </div>
          </div>

          <div className="sidebar-bottom">
            <div className="brand-block">
              <span className="brand-dot"></span>
              <div>
                <p className="brand-title">Mustafa GPT</p>
                <p className="brand-subtitle">React Preview</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="chat-area">
          <header className="chat-header">
            <button
              className="menu-btn"
              id="menuBtn"
              aria-label="Toggle sidebar"
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className="title-wrap">
              <h1>Mustafa GPT</h1>
              <p>Your smart assistant</p>
            </div>
          </header>

          <section className="chat-scroll" id="chatScroll" ref={scrollRef}>
            <div className="hero">
              <h2>How can I help you today?</h2>
              <p>Ask anything. This is a static, ChatGPT-style interface wired for quick frontend testing.</p>
            </div>

            <div className="chip-row" id="chipRow">
              {starterChips.map((chip) => (
                <button key={chip.label} className="chip" type="button" onClick={() => submitPrompt(chip.prompt)}>
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="messages" id="messages">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </div>
          </section>

          <footer className="composer-wrap">
            <form id="composerForm" className="composer" autoComplete="off" onSubmit={handleSubmit}>
              <textarea
                id="promptInput"
                placeholder="Message Mustafa GPT..."
                rows={1}
                maxLength={1000}
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submitPrompt(input);
                  }
                }}
              ></textarea>
              <button id="sendBtn" className="send-btn" type="submit" aria-label="Send message">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3.4 20.2l17.6-8.2c.9-.4.9-1.6 0-2L3.4 1.8c-.8-.4-1.7.3-1.6 1.2l.7 5.8c.1.5.5.9 1 .9h7.7c.5 0 .9.4.9.9s-.4.9-.9.9H3.5c-.5 0-.9.4-1 .9l-.7 5.8c-.1.9.8 1.6 1.6 1.2z" />
                </svg>
              </button>
            </form>
            <p className="disclaimer">Mustafa GPT can make mistakes. Verify important details.</p>
          </footer>
        </main>
      </div>
    </>
  );
}
