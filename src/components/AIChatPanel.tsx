import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mic, Sparkles, Check } from "lucide-react";
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

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialMessages: Message[] = [
  {
    id: "m1",
    role: "agent",
    content: "Hey! 👋 I'm your day planner. I can help you organize your schedule, find the best routes, or suggest activities. What would you like to plan?",
  },
];

const AIChatPanel = ({ isOpen, onClose }: AIChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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

    // Simulated agent response
    setTimeout(() => {
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: "Great idea! I've looked at your calendar and found a couple of good time slots. Here's what I suggest:",
        suggestion: {
          title: "Suggested Plan",
          items: [
            "11:30 AM – Coffee meeting at Blue Bottle (15 min walk from standup)",
            "12:30 PM – Lunch at Sweetgreen nearby",
            "Free block 4-5 PM for the new task",
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-foreground/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 h-[85vh] rounded-t-3xl bg-card flex flex-col"
          >
            {/* Handle & header */}
            <div className="flex-shrink-0">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full nav-gradient flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Day Planner AI</p>
                    <p className="text-xs text-muted-foreground">Plan & optimize your schedule</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    <p>{msg.content}</p>
                    {msg.suggestion && (
                      <div className="mt-3 p-3 rounded-xl bg-card border border-border">
                        <p className="text-xs font-semibold text-accent mb-2">{msg.suggestion.title}</p>
                        <div className="space-y-1.5">
                          {msg.suggestion.items.map((item, i) => (
                            <p key={i} className="text-xs text-muted-foreground">• {item}</p>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="h-8 rounded-xl nav-gradient text-accent-foreground text-xs gap-1">
                            <Check className="w-3 h-3" /> Confirm Plan
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs">
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
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex-shrink-0 px-4 pb-8 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-full bg-muted text-muted-foreground hover:bg-secondary">
                  <Mic className="w-5 h-5" />
                </button>
                <div className="flex-1 flex items-center gap-2 bg-muted rounded-2xl px-4 py-2.5">
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
                  className="p-2.5 rounded-full nav-gradient text-accent-foreground disabled:opacity-40"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatPanel;
