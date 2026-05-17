// app/api/gemini/route.ts
// Vidit's API proxy — takes Claude-style message payloads from the frontend
// and translates them to Gemini API format. Returns Claude-style responses.
// This lets the frontend code use the same message structure regardless of
// which AI model is running underneath.

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate API key from .env.local
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey || geminiKey === "your-api-key-here") {
      return NextResponse.json(
        { error: { message: "Gemini API key not configured. Add GEMINI_API_KEY=your_key to .env.local" } },
        { status: 500 }
      );
    }

    // 2. Map Claude-style messages → Gemini "contents" format
    //    Claude uses { role: "assistant" }, Gemini uses { role: "model" }
    //    Claude uses { type: "text", text: "..." }, Gemini uses { parts: [{ text: "..." }] }
    //    Claude uses { type: "image", source: { type: "base64", ... } }, Gemini uses inlineData
    const contents = body.messages.map((m: {
      role: string;
      content: string | Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }>;
    }) => {
      const role = m.role === "assistant" ? "model" : "user";
      let parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

      if (typeof m.content === "string") {
        parts = [{ text: m.content }];
      } else if (Array.isArray(m.content)) {
        parts = m.content.map(part => {
          if (part.type === "text") return { text: part.text };
          if (part.type === "image" && part.source?.type === "base64") {
            return { inlineData: { mimeType: part.source.media_type, data: part.source.data } };
          }
          return { text: "" };
        });
      }

      return { role, parts };
    });

    // 3. Build Gemini request payload
    const payload: {
      contents: typeof contents;
      generationConfig: { maxOutputTokens: number; temperature: number };
      systemInstruction?: { parts: Array<{ text: string }> };
    } = {
      contents,
      generationConfig: {
        maxOutputTokens: body.max_tokens ?? 1000,
        temperature: 0.7,
      },
    };

    // System prompt (if provided) maps to Gemini's systemInstruction
    if (body.system) {
      payload.systemInstruction = { parts: [{ text: body.system }] };
    }

    // 4. Call Gemini 2.5 Flash (multimodal, fast, ideal for food analysis)
    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // 5. Handle Gemini errors
    if (!res.ok) {
      return NextResponse.json(
        { error: { message: data.error?.message || "Unknown Gemini error" } },
        { status: res.status }
      );
    }

    // 6. Shape response back to Claude-style format that the frontend expects
    //    Frontend does: data.content.filter(b => b.type === "text").map(b => b.text).join("")
    const parts = data.candidates?.[0]?.content?.parts || [];
    const textContent = parts.map((p: { text?: string }) => p.text || "").join("");

    return NextResponse.json({
      content: [{ type: "text", text: textContent }],
    });

  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown server error";
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
