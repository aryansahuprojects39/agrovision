import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || "Something went wrong. Please try again.");
    return;
  }

  if (!resp.body) {
    onError("No response received.");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const json = line.slice(6).trim();
      if (json === "[DONE]") {
        onDone();
        return;
      }

      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }

  onDone();
}

const SUGGESTIONS = [
  "How do I detect crop diseases?",
  "Tips for monsoon farming",
  "Tell me about PM-KISAN scheme",
  "How to improve soil health?",
];

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: updateAssistant,
        onDone: () => setLoading(false),
        onError: (msg) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `⚠️ ${msg}` },
          ]);
          setLoading(false);
        },
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Connection error. Please try again." },
      ]);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          "bg-primary text-primary-foreground hover:scale-110",
          open && "rotate-90"
        )}
        aria-label="Toggle chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-primary/5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">AgroVision Assistant</h3>
              <p className="text-xs text-muted-foreground">Ask me anything about farming</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground h-8 w-8 p-0"
              onClick={() => {
                setMessages([]);
                setInput("");
              }}
            >
              <span className="text-xs">Clear</span>
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Hi! I'm your AgroVision AI assistant. How can I help you today?
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-accent/30 text-foreground hover:bg-accent/60 transition-colors"
                      onClick={() => send(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-2",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-accent/40 text-foreground rounded-bl-md"
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-3 w-3 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <div className="bg-accent/40 rounded-2xl rounded-bl-md px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="px-3 pb-3 pt-1 border-t border-border">
            <div className="flex gap-2 items-end">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="min-h-[40px] max-h-[100px] resize-none text-sm rounded-xl border-border"
                rows={1}
                disabled={loading}
              />
              <Button
                size="sm"
                className="h-10 w-10 rounded-xl p-0 flex-shrink-0"
                disabled={!input.trim() || loading}
                onClick={() => send(input)}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
