"use client";
import { useEffect, useState, useRef } from "react";
import { Send, MessageSquare, Clock, Trash2 } from "lucide-react";
import Sandbox from "./SandBox";

interface Chat {
  id: string;
  prompt: string;
  jsx: string;
  css: string;
  createdAt: string;
}

interface Session {
  id: string;
  title: string;
  chats: Chat[];
  createdAt: string;
}

export default function Session({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<Session | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/api/sessions/${sessionId}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          if (result.data) {
            setSession(result.data);
            if (result.data.chats && result.data.chats.length > 0) {
              setSelectedChat(result.data.chats[result.data.chats.length - 1]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
        console.log(session);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const handleSubmitPrompt = async () => {
    if (!prompt.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:4000/api/chat/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ prompt: prompt.trim(), sessionId }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result?.data) {
          const { chatId, code, css, createdAt } = result.data;

          const newChat: Chat = {
            id: chatId,
            prompt,
            jsx: code,
            css,
            createdAt: createdAt || new Date().toISOString(),
          };

          setSession((prev) =>
            prev
              ? {
                  ...prev,
                  chats: [...prev.chats, newChat],
                }
              : null
          );

          setSelectedChat(newChat); // For the Sandbox to load new JSX + CSS
          setPrompt("");

          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
          }
        }
      } else {
        const errorResult = await response.json();
        console.error(
          "Error:",
          errorResult.message || "Failed to submit prompt"
        );
      }
    } catch (error) {
      console.error("Failed to submit prompt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle textarea auto-resize
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  // Handle Enter key submission
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitPrompt();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="text-white">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen">
      {/* Left Sidebar - Chat History */}
      <div className="bg-[#212121] h-screen w-[480px] flex flex-col">
        {/* Session Header */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white mb-2">
            {session?.title || "Untitled Session"}
          </h1>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Created {session?.createdAt ? formatDate(session.createdAt) : ""}
          </p>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {session?.chats?.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No prompts yet. Start by asking something below!</p>
            </div>
          ) : (
            session?.chats?.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                  selectedChat?.id === chat.id
                    ? "bg-blue-600/20 border-blue-500/50 shadow-lg"
                    : "bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                }`}>
                <p className="text-white text-sm leading-relaxed line-clamp-3">
                  {chat.prompt}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-gray-400 text-xs">
                    {formatDate(chat.createdAt)}
                  </span>
                  {selectedChat?.id === chat.id && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Prompt Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Describe the React component you want to create..."
              className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              style={{ minHeight: "48px", maxHeight: "200px" }}
              disabled={isSubmitting}
            />
            <button
              onClick={handleSubmitPrompt}
              disabled={!prompt.trim() || isSubmitting}
              className="absolute right-2 bottom-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200">
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Right Side - Sandbox */}
      <div className="flex-1 border-l-[.5px] border-gray-700">
        <Sandbox
          appCode={
            selectedChat?.jsx ||
                `export default function App() {
                    return (
                        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="bg-gray-800 rounded-2xl shadow-2xl p-12 border border-gray-700">
                            <div className="mb-8">
                                <h1 className="text-4xl font-bold text-white mb-4">
                                Welcome to React Playground
                                </h1>
                                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                            </div>
                            
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                ${
                                session?.chats?.length === 0
                                    ? "Start by describing a React component you'd like to create in the sidebar."
                                    : "Select a prompt from the sidebar to view the generated component."
                                }
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                                Get Started
                                </button>
                                <button className="px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600">
                                Learn More
                                </button>
                            </div>
                            </div>
                        </div>
                        </div>
                    );
                }`
            }
          cssCode={selectedChat?.css}
        />
      </div>
    </div>
  );
}
