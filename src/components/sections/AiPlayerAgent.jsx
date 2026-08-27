import React, { useState, useEffect, useRef } from "react";
import { useActiveSession } from "../../hooks/useActiveSession";
import { Bot, RefreshCw, Send, User } from "lucide-react";
import { SectionActionBar } from "../ui/SectionActionBar";

const SUGGESTIONS = [
  "My weak foot is terrible. Help.",
  "How do I get faster?",
  "What should I eat before a match?",
  "How to improve my first touch?",
  "How to stay confident under pressure?",
];

const INITIAL_WELCOME = {
  sender: "agent",
  text: "Ask me anything about the beautiful game - how to improve your technique, tactics, fitness, or mindset. I'm here to help you improve your knowledge your skill and your game.\n\nPlay like you always have the ball.",
};

export function AiPlayerAgent() {
  const { session } = useActiveSession();
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("aiAgentChat");
      return saved ? JSON.parse(saved) : [INITIAL_WELCOME];
    } catch (e) {
      return [INITIAL_WELCOME];
    }
  });

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("aiAgentChat", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const activeFoot = (session?.activeFooter || "RIGHT").toUpperCase();
  const isRightFoot = activeFoot === "RIGHT";
  const playerName = session?.playerName || "Player";

  const generateCoachResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes("weak foot")) {
      return `Hey ${playerName}! To fix your weak foot, start doing 100 1-touch passes against a wall every single day with ONLY your non-dominant foot. Focus on ankle locking, keeping your hips square, and hitting the center of the ball. Within 2 weeks of daily wall work, your confidence will explode!`;
    }
    if (q.includes("faster") || q.includes("speed")) {
      return `Speed in football is all about acceleration over 5-15 meters and explosive footwork. Incorporate hill sprints, plyometric box jumps, and boundary acceleration drills 3x a week. Remember: drive your arms hard and stay on your toes!`;
    }
    if (q.includes("eat") || q.includes("nutrition") || q.includes("food")) {
      return `3 to 4 hours before kickoff: Eat complex carbs + clean protein (like oatmeal with bananas & peanut butter, or rice with grilled chicken). 1 hour before: Grab a fast-digesting fruit like an apple or banana. Stay hydrated with electrolytes!`;
    }
    if (q.includes("first touch") || q.includes("control")) {
      return `Great first touch requires cushioning the ball like a feather! As the ball approaches, pull your foot back slightly at the exact moment of impact. Practice receiving wall passes on both feet while turning into open space.`;
    }
    if (q.includes("confidence") || q.includes("mindset") || q.includes("pressure")) {
      return `Mindset separates good players from elite players! Visualize your successful passes and goals before the game. When you make a mistake, drop it instantly and focus on winning the next ball. You've put in the training!`;
    }

    return `Coach Clem Murdock here! Focus on mastering the basics: crisp 1-touch passing, relentless off-the-ball movement, and sharp decision making under pressure. What specific part of your game would you like to work on today?`;
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateCoachResponse(query);
      setMessages((prev) => [...prev, { sender: "agent", text: replyText }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleResetChat = () => {
    if (confirm("Reset AI Player Agent chat?")) {
      setMessages([INITIAL_WELCOME]);
      localStorage.removeItem("aiAgentChat");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] max-w-2xl mx-auto space-y-2 select-none overflow-hidden pb-2">
      {/* ── TOP HEADER BAR (Fixed Top) ── */}
      <div className="flex-shrink-0 p-3 rounded-2xl border border-yellow-500/30 bg-[#121015] flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          {/* Bot Avatar Icon */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FF4422] text-white flex items-center justify-center shadow-md flex-shrink-0">
            <Bot size={20} />
          </div>

          <div>
            <h2 className="text-sm sm:text-base font-black text-yellow-400 tracking-wide leading-none flex items-center gap-1.5">
              <span>AiPlayerAgent - Mentor</span>
            </h2>
            <p className="text-[10px] font-bold text-yellow-300/80 mt-1">
              Powered by Footballer Athletics
            </p>
          </div>
        </div>

        {/* New Chat Reset Button */}
        <button
          onClick={handleResetChat}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white text-[10px] font-bold uppercase transition-all border border-white/10"
        >
          <RefreshCw size={12} />
          <span>New Chat</span>
        </button>
      </div>

      {/* ── QUICK SUGGESTIONS SCROLL ROW (Fixed Top) ── */}
      <div className="flex-shrink-0 flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        {SUGGESTIONS.map((text, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(text)}
            className="px-3 py-1.5 rounded-full bg-[#181418] border border-[#FF4422]/60 hover:bg-[#FF4422]/20 text-[#FF4422] text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 active:scale-95"
          >
            {text}
          </button>
        ))}
      </div>

      {/* ── CHAT MESSAGES CONTAINER (ONLY THIS SCROLLS!) ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 py-2 pr-1">
        {/* Centered Yellow Stick Figure Graphic */}
        {messages.length <= 2 && (
          <div className="my-auto py-4 flex flex-col items-center justify-center opacity-90 pointer-events-none">
            <div className="w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
              <img
                src={isRightFoot ? "/right_foot.png" : "/left_foot.png"}
                alt="AI Mentor Kicking Icon"
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
              />
            </div>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isAgent = msg.sender === "agent";

          if (isAgent && idx === 0) {
            // Welcome Banner Card
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl border-l-4 border-[#FF4422] bg-[#141217] space-y-2 shadow-xl"
              >
                <p className="text-xs sm:text-sm font-bold text-yellow-400 leading-relaxed whitespace-pre-line">
                  {msg.text}
                </p>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                isAgent ? "justify-start" : "justify-end"
              }`}
            >
              {isAgent && (
                <div className="w-7 h-7 rounded-full bg-[#FF4422] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={15} />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm font-semibold leading-relaxed shadow-md ${
                  isAgent
                    ? "bg-[#16141C] border border-yellow-400/30 text-yellow-300 rounded-tl-none"
                    : "bg-[#FF4422] text-white rounded-tr-none"
                }`}
              >
                {msg.text}
              </div>

              {!isAgent && (
                <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User size={15} />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold italic px-2 animate-pulse">
            <Bot size={14} />
            <span>AI Mentor is thinking...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── BOTTOM CHAT INPUT ROW (Fixed Bottom) ── */}
      <div className="flex-shrink-0 pt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="How can i help you with your game?"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="w-full bg-[#16141D] border border-white/15 rounded-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-white placeholder:text-yellow-400/90 focus:outline-none focus:border-yellow-400 transition-colors shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="w-10 h-10 rounded-full bg-[#FF4422] hover:bg-[#FF6B35] text-white flex items-center justify-center shadow-lg disabled:opacity-40 transition-all flex-shrink-0 active:scale-95"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

      {/* Action Bar */}
      <div className="flex-shrink-0">
        <SectionActionBar sectionKey="ai-agent" />
      </div>
    </div>
  );
}
