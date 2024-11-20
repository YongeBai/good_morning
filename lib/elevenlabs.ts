import { ElevenLabsClient } from "elevenlabs";
import { config } from "./config";


const client = new ElevenLabsClient({
  apiKey: config.elevenlabs.apiKey,
});

export const createAudioStreamFromText = async (
  text: string
): Promise<Buffer> => {
  const audioStream = await client.generate({
    voice: config.elevenlabs.voiceId,
    model_id: config.elevenlabs.modelId,
    text,
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}; 