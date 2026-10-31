/**
 * Client for the captaincy chat.
 *
 * The browser talks to OUR backend (which proxies the cloud agent), never the
 * agent directly. We read Server-Sent Events over a POST via fetch's
 * ReadableStream (EventSource can't POST a body).
 *
 * The answer is NOT streamed token by token. The backend buffers it so it can
 * check every player name against the real FPL list first — streaming made the
 * model commit to a name before its lookups returned, which is how it ended up
 * recommending players who had left the league. What streams instead is the
 * tool trace, which drives a progress line and the "read from" footer.
 */
import { getApiEndpoint } from "@/lib/env";
import { STORAGE_KEYS, getFromLocalStorage } from "@/lib/localStorage";

const ANON_UID_KEY = "fpl_chat_uid";

/**
 * crypto.randomUUID() only exists in a secure context (HTTPS or localhost), so
 * over plain HTTP — a LAN IP during testing, say — it's undefined and throws.
 * These ids only have to be unique per browser, never unguessable, so a random
 * fallback is fine and beats taking the page down.
 */
function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Stable identity for the agent's per-user session list. No auth, so we reuse
 * the FPL manager id already in localStorage (meaningful to the agent), and
 * fall back to a persisted anonymous uuid.
 */
export function getChatUserId(): string {
  const managerId = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
  if (managerId) return `mgr-${managerId}`;

  let uid = localStorage.getItem(ANON_UID_KEY);
  if (!uid) {
    uid = `anon-${uuid()}`;
    localStorage.setItem(ANON_UID_KEY, uid);
  }
  return uid;
}

/** One id per conversation thread (the agent's memory scope). */
export function newSessionId(): string {
  return uuid();
}

export interface StreamHandlers {
  /** Progress, as each tool is called: "reading goalscorer odds". */
  onProgress?: (label: string) => void;
  /** The finished, name-checked answer. Arrives in one piece. */
  onReply: (text: string, tools: string[], warning: string | null) => void;
  onError?: (message: string) => void;
  signal?: AbortSignal;
}

export async function streamChat(
  message: string,
  userId: string,
  sessionId: string,
  { onProgress, onReply, onError, signal }: StreamHandlers,
  context?: string,
): Promise<void> {
  const resp = await fetch(getApiEndpoint("/agent/chat/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, user_id: userId, session_id: sessionId, context }),
    signal,
  });

  if (!resp.ok || !resp.body) {
    onError?.(`Request failed (${resp.status})`);
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE events are separated by a blank line.
    let sep: number;
    while ((sep = buffer.indexOf("\n\n")) !== -1) {
      const chunk = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);

      const dataLine = chunk.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      const data = dataLine.slice(5).trim();
      if (!data) continue;

      try {
        const event = JSON.parse(data) as {
          tool?: string;
          label?: string;
          reply?: string;
          tools?: string[];
          warning?: string | null;
          error?: string;
          done?: boolean;
        };
        // Tool events are progress; the reply arrives once, already validated.
        if (event.label) onProgress?.(event.label);
        else if (event.reply !== undefined) {
          onReply(event.reply, event.tools ?? [], event.warning ?? null);
        } else if (event.error) onError?.(event.error);
        // `done` just marks end-of-stream; the reader loop ends on its own.
      } catch {
        /* ignore malformed frames */
      }
    }
  }
}
