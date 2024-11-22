'use client';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  // const [audioEnabled, setAudioEnabled] = useState(false);

  const [chatStarted, setChatStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startChat = async () => {
    setChatStarted(true);
    audioRef.current = new Audio(openingAudioPath);
    if (audioEnabled) {
      await audioRef.current.play();
    }

    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Good morning sir, my name is Sundeep, this call may be recorded for quality assurance. How may I assist you today?'
    }]);
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setAudioEnabled(!audioRef.current.muted);
    }
  }
  
  const handleClearChat = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
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

      if (!response.ok) throw new Error('TTS request failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await new Promise((resolve) => {
          if (audioRef.current) {
            audioRef.current.onended = resolve;
            audioRef.current.play();
          }
        });
      }
    } catch (error) {
      console.error('TTS error:', error);
    } finally {
      setIsSpeaking(false);
      if (audioRef.current?.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
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

    if ((transcript.includes('.') || transcript.includes('!') || transcript.includes('?') || transcript.includes(',')) && Math.random() > 0.3) {
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