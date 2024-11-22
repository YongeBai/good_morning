'use client';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

import VoiceInput from "@/components/input/voice-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from 'ai/react';
import { Send, Trash2, Volume2, VolumeX, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, setMessages, append } = useChat({
    onFinish: async (message) => {
      if (message.role === 'assistant') {
        await playTTS(message.content);
      }
    },
  });

  const AFFIRMATIONS = [
    '/affirmation_1.mp3',
    '/affirmation_2.mp3',
    '/affirmation_3.mp3',
    '/affirmation_4.mp3',
    '/affirmation_5.mp3',
    '/affirmation_6.mp3',
  ];
  const openingAudioPath = '/opening_audio.mp3';

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // used for static audio files
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [chatStarted, setChatStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');

  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null); // Used for 11labs streaming
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [pausedAt, setPausedAt] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startChat = async () => {
    setChatStarted(true);
    if (audioEnabled && !audioRef.current) {
      audioRef.current = new Audio(openingAudioPath);
      await audioRef.current.play();
    }

    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Good morning sir, my name is Sundeep, this call may be recorded for quality assurance. How may I assist you today?'
    }]);
  }

  const toggleAudio = () => {
    if (audioContext && audioSource) {
      if (isPlaying) {
        audioContext.suspend();
        setPausedAt(audioContext.currentTime);
      } else {
        audioContext.resume();
        setStartedAt(startedAt + (audioContext.currentTime - pausedAt));
      }
      setIsPlaying(!isPlaying);
    }
    setAudioEnabled(!audioEnabled);
  };

  const handleClearChat = () => {
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
    if (audioSource) {
      audioSource.stop();
      setAudioSource(null);
    }
    setStartedAt(0);
    setPausedAt(0);
    setIsPlaying(false);
    startChat();
  };

  const playTTS = async (text: string) => {
    if (!audioEnabled) return;

    try {
      setIsSpeaking(true);
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.body) throw new Error('No response body');

      // Create or reuse Audio Context
      let ctx = audioContext;
      if (!ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        ctx = new AudioContext();
        setAudioContext(ctx);
      }

      // Stop any existing audio
      if (audioSource) {
        audioSource.stop();
        setAudioSource(null);
      }

      // Create new audio buffer source
      const source = ctx.createBufferSource();
      setAudioSource(source);

      // Get response as ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();

      // Decode the audio data
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      // Connect the source to the buffer and context
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      // Play the audio
      source.start(0);
      setStartedAt(ctx.currentTime);
      setIsPlaying(true);

      // Clean up when done
      source.onended = () => {
        setIsSpeaking(false);
        setIsPlaying(false);
        setAudioSource(null);
      };

    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
      setIsPlaying(false);
    }
  };

  const playAffirmation = async () => {
    if (!audioEnabled) return;
    const affirmation = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    const audio = new Audio(affirmation);
    audio.volume = 0.5;
    await audio.play();
  }

  const handleTranscript = (transcript: string) => {
    console.log('Page received transcript:', transcript);
    setCurrentTranscript(prev => prev + ' ' + transcript);

    if (
      Math.random() > 0.3 &&
      transcript.length > 10 &&
      (transcript.includes('.') || transcript.includes('!') || transcript.includes('?') || transcript.includes(','))
    ) {
      playAffirmation();
    }
  }

  const handleRecordingToggle = () => {
    if (isRecording) {
      if (currentTranscript.trim()) {
        append({
          role: 'user',
          content: currentTranscript.trim()
        });

        setCurrentTranscript('');
      }
    }
    setIsRecording(!isRecording);
  }

  if (!chatStarted) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to Tech Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Click below to start your conversation with our AI tech support agent
            </p>
            <Button
              onClick={startChat}
              size="lg"
            >
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Card className="w-full max-w-2xl mx-auto flex flex-col h-full rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-4">
            <CardTitle className="text-xl font-bold">Tech Support Chat</CardTitle>
            <Button
              onClick={toggleAudio}
              variant="ghost"
              size="icon"
              className={audioEnabled ? 'text-green-500' : 'text-gray-500'}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
          <Button
            onClick={handleClearChat}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Chat
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 overflow-hidden p-4">
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                      }`}
                  >
                    <div className="font-semibold mb-1 text-sm">
                      {message.role === 'user' ? 'You' : 'Support Agent'}
                    </div>
                    <div className="text-sm leading-relaxed break-words">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
            <Input
              name="prompt"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isSpeaking || isRecording}
            />
            <Button
              type="button"
              size="icon"
              variant={isRecording ? "destructive" : "default"}
              onClick={handleRecordingToggle}
              disabled={isSpeaking}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button type="submit" size="icon" disabled={isRecording}>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <VoiceInput
            onTranscript={handleTranscript}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
        </CardContent>
      </Card>
      <audio ref={audioRef} onEnded={() => setIsSpeaking(false)} />
    </div>
  );
}