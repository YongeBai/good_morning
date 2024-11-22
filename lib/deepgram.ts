import { config } from "./config";
import { createClient } from "@deepgram/sdk";

export const createLiveTranscription = async () => {
    const deepgram = createClient(config.deepgram.apiKey);

    const connection = await deepgram.listen.live({
        model: config.deepgram.model,
        smart_format: true,
        language: "en",
        encoding: "linear16",
        channels: 1,
        sample_rate: 16000,
    });

    return connection;
}