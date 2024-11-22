import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { config } from "./config";
import { DeepgramResponse } from "./types";

export const createLiveTranscription = async (
    onTranscript: (transcript: string) => void
) => {
    const options = {
        model: "nova-2",
        language: "en-US",
        // smart_format: true, // this mucks up the transcript makes the punctuation weird
        // interim_results: true, // this mucks up the transcript
        // utterance_end_ms: 2000,        
        punctuate: true,
        // encoding: "linear16",
        // sample_rate: 48000,
        channels: 1,
        endpointing: 80 // low endpointing to get more frequent transcript updates, going use affimration if ends with punctuation
    };

    // Create Deepgram connection
    const deepgram = createClient(config.deepgram.apiKey);
    const connection = deepgram.listen.live(options);

    // continueously send keep alive messages to keep the connection alive
    const keepAliveInterval = setInterval(() => {
        connection.keepAlive();
    }, 10000);

    // Get microphone stream with specific constraints
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
            channelCount: 1,
            // sampleRate: 48000,
            echoCancellation: true,
            noiseSuppression: true,
        }
    });

    // Create MediaRecorder with specific MIME type
    const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        bitsPerSecond: 160000
    });

    // Connect them together
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            connection.send(event.data);
        }
    };

    // Setup event handlers
    connection.on(LiveTranscriptionEvents.Open, () => {
        console.log('Deepgram connection opened');
        if (mediaRecorder.state !== 'recording') {
            mediaRecorder.start(300);
        }
    });

    connection.on(LiveTranscriptionEvents.Error, (error) => {
        console.error('Deepgram error:', error);
    });

    connection.on(LiveTranscriptionEvents.Close, () => {
        console.log('Deepgram connection closed');
    });

    connection.on(LiveTranscriptionEvents.Transcript, (data: DeepgramResponse) => {
        const transcript = data.channel.alternatives[0].transcript;
        if (transcript && transcript.trim()) {
            onTranscript(transcript);
        }
    });

    const pause = () => {
        console.log('Pausing recording');
        if (mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
        }
    };

    const resume = () => {
        console.log('Resuming recording');
        if (mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
        } else if (mediaRecorder.state === 'inactive') {
            mediaRecorder.start(300);
        }
    };

    // Final cleanup for component unmount
    const cleanup = () => {
        console.log('Final cleanup');
        clearInterval(keepAliveInterval);
        if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        stream.getTracks().forEach(track => track.stop());
        connection.disconnect();
    };

    return { pause, resume, cleanup };
};