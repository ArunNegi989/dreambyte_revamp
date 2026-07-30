// app/api/ai-chat/route.ts
// Backend endpoint the FloatingActionButtons chat panel calls.
// Swap the fetch below for whichever AI provider you use (Anthropic shown here).

import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the AI assistant for Dream Byte Solutions, a digital marketing
and web development agency in Dehradun. Answer questions about services (SEO, web development,
graphic design, performance marketing, photography/videography, event management) helpfully and
briefly. If asked something outside this scope, politely redirect to WhatsApp/call for a human.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { reply: "AI assistant is not configured yet. Please reach us on WhatsApp or call." },
        { status: 200 }
      );
    }

    const conversation = Array.isArray(history)
      ? history.map((h: { role: string; text: string }) => ({
          role: h.role === "assistant" ? "assistant" : "user",
          content: h.text,
        }))
      : [];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [...conversation, { role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI provider error: ${response.status}`);
    }

    const data = await response.json();
    const reply =
      data?.content?.find((block: any) => block.type === "text")?.text ??
      "Sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("ai-chat route error:", err);
    return NextResponse.json(
      { reply: "Something went wrong on our end. Please try WhatsApp or call us directly." },
      { status: 200 }
    );
  }
}