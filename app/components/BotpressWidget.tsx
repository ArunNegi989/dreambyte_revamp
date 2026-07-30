"use client";

import Script from "next/script";

/**
 * BotpressWidget
 * ----------------
 * Loads the SAME Botpress bot that already runs on dreambytesolution.com.
 * No Anthropic/OpenAI key needed — this bot is configured entirely on the
 * Botpress dashboard (app.botpress.cloud).
 *
 * Render this ONCE in app/layout.tsx, alongside <FloatingActionButtons />.
 *
 * IMPORTANT ONE-TIME SETUP (in Botpress dashboard):
 * 1. Go to app.botpress.cloud -> your bot -> Configuration -> Webchat (Channel).
 * 2. Under the "Style" / "Widget" section, turn OFF the default floating
 *    launcher button (it's usually called "Floating Button" or similar).
 *    This stops Botpress from showing its own circle icon, since we already
 *    have our own AI icon in FloatingActionButtons.tsx.
 * 3. Save. The same configUrl below will pick up the change automatically
 *    (no code change needed on your end).
 */

const BOTPRESS_INJECT_SRC = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
const BOTPRESS_CONFIG_URL =
  "https://files.bpcontent.cloud/2025/09/29/07/20250929073607-XS1V0BKA.json";

export default function BotpressWidget() {
  return (
    <>
      <Script src={BOTPRESS_INJECT_SRC} strategy="afterInteractive" />
      <Script src={BOTPRESS_CONFIG_URL} strategy="afterInteractive" />
    </>
  );
}