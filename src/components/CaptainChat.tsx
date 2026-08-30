import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2, RotateCcw } from "lucide-react";
import { getChatUserId, newSessionId, streamChat } from "@/services/agentChat";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "Who should I captain this week?",
  "Give me a differential captain pick",
  "Is the favourite worth captaining?",
];

const CaptainChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const sessionId = useRef<string>(newSessionId());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the latest message in view as it streams in.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (raw: string) => {
    const question = raw.trim();
    if (!question || busy) return;

    setInput("");
    setBusy(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "assistant", text: "" },
    ]);

    const appendToLast = (updater: (text: string) => string) =>
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        copy[copy.length - 1] = { ...last, text: updater(last.text) };
        return copy;
      });

    try {
      await streamChat(question, getChatUserId(), sessionId.current, {
        onDelta: (delta) => appendToLast((text) => text + delta),
        onError: (msg) => appendToLast(() => `⚠️ ${msg}`),
      });
    } catch (e) {
      appendToLast(() => "⚠️ Something went wrong reaching the assistant.");
    } finally {
      setBusy(false);
    }
  };

  const resetChat = () => {
    if (busy) return;
    sessionId.current = newSessionId();
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <Card className="flex flex-col h-[32rem]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Captaincy Assistant
        </CardTitle>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={resetChat} disabled={busy}>
            <RotateCcw className="h-4 w-4 mr-1" /> New chat
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex flex-col flex-1 min-h-0 gap-3">
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-3">
              <Sparkles className="h-8 w-8 text-primary/60" />
              <p className="text-sm max-w-xs">
                Ask about captaincy for the upcoming gameweek — powered by live odds and FPL data.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs rounded-full border px-3 py-1 hover:bg-accent transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-3 py-2 text-sm"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm whitespace-pre-wrap"
                  }
                >
                  {m.text || (busy && <Loader2 className="h-4 w-4 animate-spin" />)}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about captaincy…"
            className="min-h-[2.5rem] max-h-32 resize-none"
            rows={1}
            disabled={busy}
          />
          <Button size="icon" onClick={() => send(input)} disabled={busy || !input.trim()}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaptainChat;
