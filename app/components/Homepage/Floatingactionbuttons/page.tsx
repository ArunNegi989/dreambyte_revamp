"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Floatingactionbuttons.module.css";

/**
 * FloatingActionButtons
 * ----------------------
 * Fixed floating widget (WhatsApp / Call / AI Chat / Scroll-to-top)
 * + a premium branded AI Assistant chat panel.
 *
 * Drop this + FloatingActionButtons.module.css into your project
 * (ideally rendered once in app/layout.tsx so it shows on every page).
 */

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
  feedback?: "up" | "down" | null;
}

const WHATSAPP_NUMBER = "918279720490";
const CALL_NUMBER = "+918279720490";
const WHATSAPP_DEFAULT_MESSAGE = "Hello, I'm interested in your services.";

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function BrandMark({ className }: { className?: string }) {
  // Minimal wolf/bat-style monogram mark echoing the Dream Byte logo silhouette
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="url(#dbGrad)" />
      <path
        d="M12 15 L16 24 L20 17 L24 24 L28 15"
        stroke="#0d0f14"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="24.5" r="1.6" fill="#0d0f14" />
      <defs>
        <linearGradient id="dbGrad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#ff7a3c" />
          <stop offset="100%" stopColor="#ffb800" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function FloatingActionButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm the Dream Byte AI assistant. Ask me about our services, pricing, or how we can help grow your brand.",
      time: formatTime(),
    },
  ]);

  const [isMuted, setIsMuted] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen, isMinimized]);

  useEffect(() => {
    if (isChatOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isChatOpen, isMinimized]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const playDing = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx =
          window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch {
      // audio not supported / blocked — fail silently
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Dream Byte Solutions",
      text: "Chat with the Dream Byte AI assistant",
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 1800);
      }
    } catch {
      // user cancelled share sheet — ignore
    }
  };

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      WHATSAPP_DEFAULT_MESSAGE
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCallClick = () => {
    window.location.href = `tel:${CALL_NUMBER}`;
  };

  const handleReset = () => {
    setMessages([
      {
        id: `${Date.now()}-welcome`,
        role: "assistant",
        text: "Conversation reset. What would you like to know about Dream Byte Solutions?",
        time: formatTime(),
      },
    ]);
  };

  const handleFeedback = (id: string, value: "up" | "down") => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, feedback: m.feedback === value ? null : value } : m
      )
    );
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmed,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!res.ok) throw new Error("AI chat request failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: data.reply ?? "Sorry, I couldn't process that. Please try again.",
          time: formatTime(),
        },
      ]);
      playDing();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text: "Something went wrong. Please try again, or reach us directly on WhatsApp.",
          time: formatTime(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating icon stack */}
      <div className={styles.fabStack}>
        <button
          type="button"
          className={`${styles.fabButton} ${styles.whatsapp}`}
          onClick={handleWhatsAppClick}
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 32 32" className={styles.icon} aria-hidden="true">
            <path
              fill="currentColor"
              d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.24.6 4.36 1.66 6.18L4 29l7.96-2.1a12.9 12.9 0 0 0 4.08.66c6.64 0 12.04-5.4 12.04-12.04C28.08 8.4 22.68 3 16.04 3Zm0 21.86c-1.3 0-2.58-.24-3.78-.72l-.27-.1-4.72 1.24 1.26-4.6-.18-.28a9.9 9.9 0 0 1-1.53-5.36c0-5.46 4.44-9.9 9.92-9.9 2.65 0 5.14 1.04 7.01 2.91a9.84 9.84 0 0 1 2.9 7c0 5.46-4.44 9.91-9.91 9.91Zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48c0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.09 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"
            />
          </svg>
          <span className={styles.tooltip}>WhatsApp</span>
        </button>

        <button
          type="button"
          className={`${styles.fabButton} ${styles.call}`}
          onClick={handleCallClick}
          aria-label="Call us"
        >
          <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
            <path
              fill="currentColor"
              d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.3 11.3 0 0 0 3.54.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.54a1 1 0 0 1-.25 1.02l-2.2 2.2Z"
            />
          </svg>
          <span className={styles.tooltip}>Call Us</span>
        </button>

        <button
          type="button"
          className={`${styles.fabButton} ${styles.aiChat}`}
          onClick={() => {
            // Opens the custom AI chat panel directly.
            // (Botpress dependency removed — was silently failing to open
            // because window.botpress existed but its config never
            // loaded properly, so bp.open() did nothing.)
            setIsChatOpen((prev) => !prev);
            setIsMinimized(false);
          }}
          aria-label="Chat with AI assistant"
          aria-expanded={isChatOpen}
        >
          <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3C6.48 3 2 6.94 2 11.8c0 2.63 1.35 4.98 3.48 6.58-.12 1.15-.5 2.6-1.34 3.98a.5.5 0 0 0 .58.74c1.9-.53 3.53-1.42 4.6-2.13.85.19 1.75.29 2.68.29 5.52 0 10-3.94 10-8.8S17.52 3 12 3Z"
            />
            <circle cx="8.3" cy="11.8" r="1.15" fill="var(--db-bg-deep, #0a0c11)" />
            <circle cx="12" cy="11.8" r="1.15" fill="var(--db-bg-deep, #0a0c11)" />
            <circle cx="15.7" cy="11.8" r="1.15" fill="var(--db-bg-deep, #0a0c11)" />
          </svg>
          <span className={styles.tooltip}>Ask AI</span>
        </button>

        {showScrollTop && (
          <button
            type="button"
            className={`${styles.fabButton} ${styles.scrollTop}`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 5.5 5.5 12l1.4 1.4L11 9.3V19h2V9.3l4.1 4.1L18.5 12 12 5.5Z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* AI Chat Panel */}
      {isChatOpen && (
        <div className={`${styles.chatPanel} ${isMinimized ? styles.chatPanelMinimized : ""}`}>
          <div className={styles.glowLine} />

          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <BrandMark className={styles.headerLogo} />
              <div>
                <div className={styles.headerTitle}>Dream Byte Solutions</div>
                <div className={styles.headerSubtitle}>Ask us anything</div>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setIsMinimized((prev) => !prev)}
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <svg viewBox="0 0 24 24" className={styles.headerIcon} aria-hidden="true">
                  <path fill="currentColor" d="M5 11h14v2H5z" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setIsChatOpen(false)}
                aria-label="Close chat"
                title="Close"
              >
                <svg viewBox="0 0 24 24" className={styles.headerIcon} aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className={styles.chatToolbar}>
                <span className={styles.agentBadge}>
                  <span className={styles.statusDot} />
                  Brand Assistant
                  <button
                    type="button"
                    className={styles.resetBtn}
                    onClick={handleReset}
                    aria-label="Restart conversation"
                    title="Restart conversation"
                  >
                    <svg viewBox="0 0 24 24" className={styles.resetIcon} aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M12 5V2L7 6l5 4V7c3.31 0 6 2.69 6 6a6 6 0 0 1-6 6 6 6 0 0 1-6-6H4a8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8Z"
                      />
                    </svg>
                  </button>
                </span>

                <div className={styles.toolbarRight}>
                  <button
                    type="button"
                    className={styles.toolbarIconBtn}
                    onClick={() => setIsMuted((prev) => !prev)}
                    aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <svg viewBox="0 0 24 24" className={styles.toolbarIcon} aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M16.5 12 20 15.5 18.6 16.9 15.1 13.4 11.6 16.9 10.2 15.5 13.7 12 10.2 8.5 11.6 7.1 15.1 10.6 18.6 7.1 20 8.5 16.5 12ZM3 9v6h4l5 5V4L7 9H3Z"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className={styles.toolbarIcon} aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12Zm-2.5-8.77v2.06A7 7 0 0 1 19 12a7 7 0 0 1-5 6.71v2.06A9 9 0 0 0 21 12a9 9 0 0 0-7-8.77Z"
                        />
                      </svg>
                    )}
                  </button>

                  <button
                    type="button"
                    className={styles.shareBtn}
                    onClick={handleShare}
                    aria-label="Share this chat"
                  >
                    {shareCopied ? "Copied!" : "Share"}
                    <svg viewBox="0 0 24 24" className={styles.toolbarIcon} aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M14 3v2h3.59L9.17 13.41 10.59 14.83 19 6.41V10h2V3h-7ZM5 5h5V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5h-2v5H5V5Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className={styles.chatBody}>
                <div className={styles.dateDivider}>
                  <span>Today</span>
                </div>

                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`${styles.messageRow} ${
                      m.role === "user" ? styles.userRow : styles.assistantRow
                    }`}
                  >
                    {m.role === "assistant" && (
                      <div className={styles.avatar}>
                        <BrandMark className={styles.avatarIcon} />
                      </div>
                    )}

                    <div className={styles.bubbleColumn}>
                      <div
                        className={`${styles.messageBubble} ${
                          m.role === "user" ? styles.userBubble : styles.assistantBubble
                        }`}
                      >
                        {m.text}
                      </div>

                      {m.role === "user" ? (
                        <span className={styles.metaRight}>Delivered · {m.time}</span>
                      ) : (
                        <div className={styles.metaRow}>
                          <span className={styles.metaLeft}>{m.time}</span>
                          <div className={styles.feedbackRow}>
                            <button
                              type="button"
                              className={`${styles.feedbackBtn} ${
                                m.feedback === "up" ? styles.feedbackActiveUp : ""
                              }`}
                              onClick={() => handleFeedback(m.id, "up")}
                              aria-label="Helpful"
                            >
                              <svg viewBox="0 0 24 24" className={styles.feedbackIcon}>
                                <path
                                  fill="currentColor"
                                  d="M2 20h3V9H2v11Zm19-10.5A2.5 2.5 0 0 0 18.5 7H14l.72-3.44.02-.24c0-.38-.16-.73-.41-.98L13.5 1.5 7.59 7.41C7.22 7.78 7 8.28 7 8.83V18a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.5Z"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className={`${styles.feedbackBtn} ${
                                m.feedback === "down" ? styles.feedbackActiveDown : ""
                              }`}
                              onClick={() => handleFeedback(m.id, "down")}
                              aria-label="Not helpful"
                            >
                              <svg viewBox="0 0 24 24" className={styles.feedbackIcon}>
                                <path
                                  fill="currentColor"
                                  d="M22 4h-3v11h3V4ZM3 14.5A2.5 2.5 0 0 0 5.5 17H10l-.72 3.44-.02.24c0 .38.16.73.41.98l1.09.98 5.91-5.91c.36-.36.58-.86.58-1.41V6a2 2 0 0 0-2-2H6c-.83 0-1.54.5-1.84 1.22L1.14 12.27c-.09.23-.14.47-.14.73v1.5Z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div className={`${styles.messageRow} ${styles.assistantRow}`}>
                    <div className={styles.avatar}>
                      <BrandMark className={styles.avatarIcon} />
                    </div>
                    <div className={`${styles.messageBubble} ${styles.assistantBubble} ${styles.typingBubble}`}>
                      <span className={styles.typingDot} />
                      <span className={styles.typingDot} />
                      <span className={styles.typingDot} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className={styles.chatInputRow}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className={styles.chatInput}
                  disabled={isSending}
                />
                <button
                  type="button"
                  className={styles.sendBtn}
                  onClick={handleSend}
                  disabled={isSending || !input.trim()}
                  aria-label="Send message"
                >
                  <svg viewBox="0 0 24 24" className={styles.sendIcon} aria-hidden="true">
                    <path fill="currentColor" d="M3 20 21 12 3 4v6l14 2-14 2v6Z" />
                  </svg>
                </button>
              </div>

              <div className={styles.chatFooter}>
                <svg viewBox="0 0 24 24" className={styles.footerBolt} aria-hidden="true">
                  <path fill="currentColor" d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
                </svg>
                Powered by Dream Byte AI
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}