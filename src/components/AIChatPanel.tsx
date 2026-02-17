import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mic, Sparkles, Check, ChevronDown, MessageSquare, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  suggestion?: {
    title: string;
    items: string[];
  };
}

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messages: Message[];
}

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialMessages: Message[] = [
  {
    id: "m1",
    role: "agent",
    content: "Hey! 👋 I can help plan your day. What would you like to organize?",
  },
];

const mockHistory: ChatSession[] = [
  {
    id: "h1",
    title: "Weekend brunch plan",
    preview: "Sure! I found 3 brunch spots near you…",
    timestamp: "Yesterday",
    messages: [
      { id: "h1m1", role: "user", content: "Find me brunch spots for Saturday" },
      { id: "h1m2", role: "agent", content: "Sure! I found 3 brunch spots near you. Here are my top picks:" },
    ],
  },
  {
    id: "h2",
    title: "Airport transfer",
    preview: "Your flight is at 3 PM, so I suggest…",
    timestamp: "2 days ago",
    messages: [
      { id: "h2m1", role: "user", content: "I need to get to the airport by 3 PM" },
      { id: "h2m2", role: "agent", content: "Your flight is at 3 PM, so I suggest leaving by 1:15 PM via transit." },
    ],
  },
  {
    id: "h3",
    title: "Museum day itinerary",
    preview: "I've lined up 3 museums with lunch…",
    timestamp: "Last week",
    messages: [
      { id: "h3m1", role: "user", content: "Plan a museum day for me" },
      { id: "h3m2", role: "agent", content: "I've lined up 3 museums with lunch in between. Here's the plan:" },
    ],
  },
];

const AIChatPanel = ({ isOpen, onClose }: AIChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: "Here's what I suggest:",
        suggestion: {
          title: "Suggested Plan",
          items: [
            "11:30 AM – Coffee at Blue Bottle",
            "12:30 PM – Lunch at Sweetgreen",
            "Free block 4-5 PM for new task",
          ],
        },
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
          className={`fixed z-[60] right-3 left-3 ${
            isExpanded ? "bottom-3 top-20" : "bottom-3"
          }`}
          style={{ pointerEvents: "auto" }}
        >
          <div className={`bg-card/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 flex flex-col overflow-hidden ${
            isExpanded ? "h-full" : "max-h-[360px]"
          }`}>
            {/* Compact header */}
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full nav-gradient flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent-foreground" />
                </div>
                <p className="text-sm font-bold text-foreground">
                  {showHistory ? "Chat History" : "Day Planner AI"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-1.5 rounded-full hover:bg-muted"
                  title={showHistory ? "Back to chat" : "Chat history"}
                >
                  {showHistory ? (
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-full hover:bg-muted"
                >
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* History view */}
            {showHistory ? (
              <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1.5 min-h-0">
                {mockHistory.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      setMessages(session.messages);
                      setShowHistory(false);
                    }}
                    className="w-full text-left p-3 rounded-2xl hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-[13px] font-semibold text-foreground truncate">{session.title}</p>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">{session.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">{session.preview}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* Messages – compact scrollable area */
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-1 space-y-2 min-h-0">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      <p>{msg.content}</p>
                      {msg.suggestion && (
                        <div className="mt-2 p-2.5 rounded-xl bg-card border border-border">
                          <p className="text-[11px] font-semibold text-accent mb-1.5">{msg.suggestion.title}</p>
                          <div className="space-y-1">
                            {msg.suggestion.items.map((item, i) => (
                              <p key={i} className="text-[11px] text-muted-foreground">• {item}</p>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" className="h-7 rounded-xl nav-gradient text-accent-foreground text-[11px] gap-1 px-3">
                              <Check className="w-3 h-3" /> Confirm
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 rounded-xl text-[11px] px-3">
                              Adjust
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-3.5 py-2.5">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input bar – hidden when viewing history */}
            {!showHistory && (
            <div className="flex-shrink-0 px-3 pb-4 pt-2">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-secondary flex-shrink-0">
                  <Mic className="w-4 h-4" />
                </button>
                <div className="flex-1 flex items-center gap-2 bg-muted rounded-2xl px-3 py-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Plan my afternoon..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="p-2 rounded-full nav-gradient text-accent-foreground disabled:opacity-40 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatPanel;
