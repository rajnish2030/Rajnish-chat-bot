import { useEffect, useRef, useState } from "react";
import {
  Bot,
  User,
  Settings,
  Send,
  Trash2,
  Menu,
  X,
  Sparkles,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

function App() {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("English");
  const [style, setStyle] = useState("Simple");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setInput("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name || "User",
          language,
          style,
          input: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to get response from server."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content:
            error.message ||
            "Something went wrong. Please try again.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(
      e.target.scrollHeight,
      180
    )}px`;
  };

  const clearChat = () => {
    setMessages([]);
  };

  const startPrompt = (prompt) => {
    setInput(prompt);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden text-slate-900">

      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static z-50
          top-0 left-0
          h-full
          w-72
          bg-slate-950
          text-white
          flex flex-col
          transform transition-transform duration-300
          ${
            showSidebar
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-white text-slate-950 flex items-center justify-center">
              <Sparkles size={20} />
            </div>

            <div>
              <h1 className="font-bold text-lg">
                Rajnish AI
              </h1>

              <p className="text-xs text-slate-400">
                LangChain Assistant
              </p>
            </div>

          </div>

          <button
            onClick={() => setShowSidebar(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>

        </div>

        <div className="p-4">

          <button
            onClick={() => setMessages([])}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition"
          >
            <MessageSquare size={18} />

            <span className="text-sm font-medium">
              New Chat
            </span>
          </button>

        </div>

        <div className="flex-1 px-4 overflow-y-auto">

          <p className="text-xs uppercase tracking-wider text-slate-500 px-2 mb-3">
            Chat
          </p>

          {messages.length > 0 ? (
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
              <MessageSquare size={17} />

              <span className="text-sm truncate">
                Current conversation
              </span>
            </div>
          ) : (
            <p className="text-sm text-slate-500 px-3">
              No conversations yet
            </p>
          )}

        </div>

        <div className="p-4 border-t border-white/10">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <User size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {name || "Guest User"}
              </p>

              <p className="text-xs text-slate-500">
                AI Chat
              </p>
            </div>

          </div>

        </div>

      </aside>

      <div className="flex-1 flex flex-col min-w-0">

        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 shrink-0">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu size={21} />
            </button>

            <div>

              <h2 className="font-semibold text-base md:text-lg">
                AI Assistant
              </h2>

              <div className="flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-green-500" />

                <span className="text-xs text-slate-500">
                  Online
                </span>

              </div>

            </div>

          </div>

          <div className="flex items-center gap-1">

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2.5 rounded-xl transition ${
                showSettings
                  ? "bg-slate-100"
                  : "hover:bg-slate-100"
              }`}
              title="Settings"
            >
              <Settings size={19} />
            </button>

            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className="p-2.5 rounded-xl hover:bg-slate-100 disabled:opacity-30"
              title="Clear chat"
            >
              <Trash2 size={19} />
            </button>

          </div>

        </header>

        {showSettings && (
          <div className="bg-white border-b shadow-sm px-4 md:px-6 py-5">

            <div className="max-w-5xl mx-auto">

              <div className="flex items-center justify-between mb-4">

                <div>
                  <h3 className="font-semibold">
                    Chat Settings
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Customize how the AI responds.
                  </p>
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X size={18} />
                </button>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Your Name
                  </label>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Language
                  </label>

                  <div className="relative">

                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="appearance-none w-full border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 bg-white outline-none focus:ring-2 focus:ring-slate-900/10"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Hinglish</option>
                    </select>

                    <ChevronDown
                      size={17}
                      className="absolute right-3 top-3.5 pointer-events-none text-slate-400"
                    />

                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Answer Style
                  </label>

                  <div className="relative">

                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="appearance-none w-full border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 bg-white outline-none focus:ring-2 focus:ring-slate-900/10"
                    >
                      <option>Simple</option>
                      <option>Detailed</option>
                      <option>Professional</option>
                      <option>Interview Ready</option>
                    </select>

                    <ChevronDown
                      size={17}
                      className="absolute right-3 top-3.5 pointer-events-none text-slate-400"
                    />

                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        <main className="flex-1 overflow-y-auto">

          <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">

            {messages.length === 0 ? (

              <div className="min-h-[calc(100vh-230px)] flex flex-col items-center justify-center text-center">

                <div className="w-16 h-16 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-lg mb-5">
                  <Sparkles size={30} />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  How can I help you?
                </h2>

                <p className="text-slate-500 mt-3 max-w-lg">
                  Ask me anything. I can help with coding,
                  learning, explanations, ideas, and more.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-2xl">

                  <button
                    onClick={() =>
                      startPrompt("Explain LangChain in simple terms")
                    }
                    className="text-left p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-sm transition"
                  >
                    <p className="font-medium">
                      Learn something
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Explain LangChain in simple terms
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      startPrompt("Give me a Python coding example")
                    }
                    className="text-left p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-sm transition"
                  >
                    <p className="font-medium">
                      Write code
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Give me a Python coding example
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      startPrompt("Teach me RAG step by step")
                    }
                    className="text-left p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-sm transition"
                  >
                    <p className="font-medium">
                      Study
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Teach me RAG step by step
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      startPrompt("Help me prepare for an AI ML interview")
                    }
                    className="text-left p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-sm transition"
                  >
                    <p className="font-medium">
                      Interview preparation
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Prepare me for an AI/ML interview
                    </p>
                  </button>

                </div>

              </div>

            ) : (

              <div className="space-y-7">

                {messages.map((message, index) => {

                  const isUser = message.role === "user";
                  const isError = message.role === "error";

                  return (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        isUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      {!isUser && (
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isError
                              ? "bg-red-100 text-red-600"
                              : "bg-slate-950 text-white"
                          }`}
                        >
                          <Bot size={18} />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] md:max-w-[75%] ${
                          isUser
                            ? "items-end"
                            : "items-start"
                        } flex flex-col`}
                      >

                        <div
                          className={`rounded-2xl px-4 py-3.5 leading-7 whitespace-pre-wrap ${
                            isUser
                              ? "bg-slate-950 text-white rounded-br-md"
                              : isError
                              ? "bg-red-50 text-red-700 border border-red-100 rounded-bl-md"
                              : "bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm"
                          }`}
                        >
                          {message.content}
                        </div>

                        <span className="text-[11px] text-slate-400 mt-1.5 px-1">
                          {message.time}
                        </span>

                      </div>

                      {isUser && (
                        <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                          <User size={18} />
                        </div>
                      )}

                    </div>
                  );
                })}

                {loading && (
                  <div className="flex gap-3">

                    <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center shrink-0">
                      <Bot size={18} />
                    </div>

                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-bl-md px-5 py-4">

                      <div className="flex gap-1.5">

                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />

                        <span
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />

                        <span
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />

                      </div>

                    </div>

                  </div>
                )}

                <div ref={messagesEndRef} />

              </div>

            )}

          </div>

        </main>

        <div className="bg-white border-t px-4 md:px-6 py-4 shrink-0">

          <div className="max-w-4xl mx-auto">

            <div className="relative border border-slate-300 rounded-2xl bg-white shadow-sm focus-within:border-slate-500 focus-within:ring-2 focus-within:ring-slate-900/5">

              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Message Rajnish AI..."
                rows={1}
                className="w-full resize-none bg-transparent outline-none px-4 pt-4 pb-14 pr-16 max-h-44 text-sm md:text-base"
              />

              <div className="absolute bottom-2.5 right-2.5">

                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center hover:bg-slate-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>

              </div>

            </div>

            <div className="flex items-center justify-between mt-2 px-1">

              <p className="text-[11px] text-slate-400">
                Enter to send • Shift + Enter for new line
              </p>

              <p className="hidden sm:block text-[11px] text-slate-400">
                Powered by LangChain
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;
