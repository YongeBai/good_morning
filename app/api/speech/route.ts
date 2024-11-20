import { createAudioStreamFromText } from "@/lib/elevenlabs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const audioContent = await createAudioStreamFromText(text);

    return new NextResponse(audioContent, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioContent.length.toString(),
      },
    });
  } catch (error) {
    console.error("Speech synthesis error:", error);
    return NextResponse.json({ error: "Failed to synthesize speech" }, { status: 500 });
  }
} 