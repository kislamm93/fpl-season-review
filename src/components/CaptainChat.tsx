import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2, RotateCcw } from "lucide-react";
import { getChatUserId, newSessionId, streamChat } from "@/services/agentChat";

interface Message {
  role: "user" | "assistant";
  text: string;
  /** Tools the agent actually read, shown under the answer as provenance. */
  tools?: string[];
  /** Set when the name check couldn't verify a player it named. */
  warning?: string | null;
}

const SUGGESTIONS = [
  "Who should I captain this week?",
  "Best defence to back?",
  "How am I doing in my league?",
  "Who's in form right now?",
];

/** Tool name -> what to call it in the "read" footer. */
const SOURCE_LABELS: Record<string, string> = {
  goalscorer_odds: "goalscorer odds",
  clean_sheet_odds: "clean-sheet odds",
  match_odds: "match odds",
  fixture_difficulty: "fixture difficulty",
  players: "squad data",
  player_detail: "player history",
  manager: "manager history",
  manager_squad: "your squad",
  league: "league table",
  current_gameweek: "gameweek",
};

interface CaptainChatProps {
  /** What the user is looking at, so questions like "best here?" resolve. */
  context?: string;
}

const CaptainChat = ({ context }: CaptainChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
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

    const setLast = (patch: Partial<Message>) =>
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { ...copy[copy.length - 1], ...patch };
        return copy;
      });

    try {
      await streamChat(
        question,
        getChatUserId(),
        sessionId.current,
        {
          onProgress: (label) => setProgress(label),
          onReply: (text, tools, warning) => setLast({ text, tools, warning }),
          onError: (msg) => setLast({ text: `⚠️ ${msg}` }),
        },
        context,
      );
    } catch (e) {
      setLast({ text: "⚠️ Something went wrong reaching the assistant." });
    } finally {
      setProgress(null);
      setBusy(false);
    }
  };

  const resetChat = () => {
    if (busy) return;
    sessionId.current = newSessionId();
    setMessages([]);
    setProgress(null);
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
          FPL Analyst
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
                Ask about captaincy, transfers, fixtures or your mini-league — answered
                from live odds and FPL data.
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
                <div className="max-w-[85%] flex flex-col gap-1.5">
                  <div
                    className={
                      m.role === "user"
                        ? "rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-3 py-2 text-sm"
                        : "rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm whitespace-pre-wrap"
                    }
                  >
                    {m.text || (
                      /* The answer arrives in one piece once it's name-checked,
                         so the wait shows what the agent is doing instead. */
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                        {progress ?? "thinking"}…
                      </span>
                    )}
                  </div>
                  {m.warning && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 px-1">
                      {m.warning}
                    </p>
                  )}
                  {!!m.tools?.length && (
                    <p className="text-[11px] text-muted-foreground px-1">
                      read:{" "}
                      {m.tools
                        .filter((t) => t !== "current_gameweek")
                        .map((t) => SOURCE_LABELS[t] ?? t)
                        .join(" · ")}
                    </p>
                  )}
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
            placeholder="Ask anything about your FPL…"
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
