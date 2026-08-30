/**
 * Client for the captaincy chat.
 *
 * The browser talks to OUR backend (which proxies/streams from the cloud agent),
 * never the agent directly. We stream Server-Sent Events over a POST via fetch's
 * ReadableStream (EventSource can't POST a body).
 */
import { getApiEndpoint } from "@/lib/env";
import { STORAGE_KEYS, getFromLocalStorage } from "@/lib/localStorage";

const ANON_UID_KEY = "fpl_chat_uid";

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
    uid = `anon-${crypto.randomUUID()}`;
    localStorage.setItem(ANON_UID_KEY, uid);
  }
  return uid;
}

/** One id per conversation thread (the agent's memory scope). */
export function newSessionId(): string {
  return crypto.randomUUID();
}

export interface StreamHandlers {
  onDelta: (text: string) => void;
  onError?: (message: string) => void;
  signal?: AbortSignal;
}

export async function streamChat(
  message: string,
  userId: string,
  sessionId: string,
  { onDelta, onError, signal }: StreamHandlers,
): Promise<void> {
  const resp = await fetch(getApiEndpoint("/agent/chat/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, user_id: userId, session_id: sessionId }),
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
        const event = JSON.parse(data) as { delta?: string; error?: string; done?: boolean };
        if (event.delta) onDelta(event.delta);
        else if (event.error) onError?.(event.error);
        // `done` just marks end-of-stream; the reader loop ends on its own.
      } catch {
        /* ignore malformed frames */
      }
    }
  }
}
