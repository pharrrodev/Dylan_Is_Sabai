import { GoogleGenerativeAI } from "@google/generative-ai";
import { type NextRequest, NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `You are the Sabai Guardian for the SabaiTax UK app. You only answer questions about:
1. UK HMRC tax rules for creators (self-assessment, Making Tax Digital, allowable expenses, deadlines, National Insurance for sole traders, etc.).
2. How to use this specific ledger app (adding income/expense entries, connecting to HMRC via the HMRC Auth page, reviewing totals on the Executive Summary, and the Submit to HMRC workflow).

If a user asks about anything else (weather, time, general life advice, code, politics, sports, recipes, etc.) you must politely refuse by saying:
"I am the Sabai Guardian, I am specialized only in UK Taxes and this application. I cannot assist with that request."

Keep answers concise, helpful, and jargon-free. When referencing tax figures use GBP (£). Always remind the user this is not formal tax advice and they should consult a qualified accountant for binding decisions.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  let body: { message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const userMessage = typeof body.message === "string" ? body.message.trim() : "";
  if (!userMessage) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 },
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const result = await model.generateContent(userMessage);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Gemini request failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
