import { ElevenLabsClient } from "elevenlabs";
import { config } from "./config";

const client = new ElevenLabsClient({
  apiKey: config.elevenlabs.apiKey,
});

export const createAudioStreamFromText = async (text: string) => {
  const audioStream = await client.generate({
    voice: config.elevenlabs.voiceId,
    model_id: config.elevenlabs.modelId,
    text,
    stream: true
  });

  return audioStream;
}; 