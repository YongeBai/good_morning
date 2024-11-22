import { createAudioStreamFromText } from "@/lib/elevenlabs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const audioStream = await createAudioStreamFromText(text);
    
    // Collect all chunks first
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }
    
    // Combine all chunks into a single buffer
    const audioContent = Buffer.concat(chunks);

    return new Response(audioContent, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Speech synthesis error:", error);
    return NextResponse.json({ error: "Failed to synthesize speech" }, { status: 500 });
  }
} 