# Good Morning

## Overview
A real-time voice and text chatbot using Next.js, featuring automatic speech-to-text, text-to-speech, and AI responses. The bot automatically responds to user input after detecting silence or receiving text input.

## Key Technologies

Groq (via Vercel AI SDK) for AI responses
Deepgram WebSocket API for real-time transcription
11Labs for text-to-speech
Socket.io for real-time communication
Shadcn/ui for component library
MediaStream API for voice capture

## Core Features

Voice Input

Real-time speech capture using MediaStream API
Streaming transcription via Deepgram WebSocket
3-second silence detection for automatic response triggering
No interruption handling required - bot continues speaking

Text Input

Standard text input field
Immediate bot response upon submission

Chat Memory

Server-side conversation history
Maximum 10 responses before reset
No persistence required

Bot Responses

Non-streaming Groq responses
Automatic 11Labs TTS playback
50% chance of affirmative responses (e.g. "uh huh", "mm hmm", "I see") between user sentences, not sent to LLM only for TTS
Visual indication during TTS playback

## Project Structure
Copy.
├── app
│   ├── api
│   │   ├── chat
│   │   │   └── route.ts         # Groq handler
│   │   └── speech
│   │       └── route.ts         # 11Labs TTS endpoint
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── chat-container.tsx       # Main chat UI
│   ├── chat-message.tsx         # Message bubbles
│   ├── tts-indicator.tsx        # Speaking status
│   ├── input
│   │   ├── text-input.tsx       # Text input
│   │   └── voice-input.tsx      # Voice capture + silence detection
│   └── ui/                      # Shadcn components
├── lib
│   ├── deepgram.ts             # Deepgram WebSocket client
│   ├── groq.ts                 # Groq client setup
│   ├── elevenlabs.ts           # TTS utilities
│   ├── types.ts                # Type definitions
│   └── utils.ts                # Helper functions
└── config.ts                   # API keys and constants

## Technical Requirements

Voice Processing

3-second silence detection threshold
Real-time transcription display
Automatic TTS playback
No need for manual TTS controls

Memory Management

Server-side conversation tracking
Reset after 10 responses
No persistence between sessions

UI/UX

Right-aligned user messages (text/voice)
Left-aligned bot messages
Visual TTS playback indicator
Recording status indicator
Simple chat interface
Input method toggle (voice/text)

## API Keys Required

Groq API key
Deepgram API key
11Labs API key

## Limitations/Constraints

No interruption handling
No persistence between sessions
Maximum 10 responses before reset
No manual TTS controls needed
Single conversation thread only