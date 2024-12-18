# Good Morning

## Overview
A real-time voice and text chatbot using Next.js, featuring automatic speech-to-text, text-to-speech, and AI responses. The bot automatically responds to user input after detecting silence if receiving voice input or after receiving text input.

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


Bot Responses

Non-streaming Groq responses
Automatic 11Labs TTS playback
50% chance of affirmative responses (e.g. "uh huh", "mm hmm", "I see") between user sentences, not sent to LLM only for TTS
Visual indication during TTS playback

## Project Structure
.
├── app
│   ├── api
│   ├── favicon.ico
│   ├── fonts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── input
│   └── ui
├── components.json
├── frontend
├── lib
│   ├── config.ts
│   ├── deepgram.ts
│   ├── elevenlabs.ts
│   ├── types.ts
│   └── utils.ts
├── next.config.mjs
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── public
│   ├── affirmation_1.mp3
│   ├── affirmation_2.mp3
│   ├── affirmation_3.mp3
│   ├── affirmation_4.mp3
│   ├── affirmation_5.mp3
│   ├── affirmation_6.mp3
│   └── opening_audio.mp3
├── README.md
├── tailwind.config.ts
└── tsconfig.json

## Technical Requirements

Voice Processing

3-second silence detection threshold
Real-time transcription display
Automatic TTS playback
No need for manual TTS controls

Memory Management

Server-side conversation tracking


UI/UX

Right-aligned user messages (text/voice)
Left-aligned bot messages
Visual TTS playback indicator
Recording status indicator
Simple chat interface
Input method toggle (voice/text)

## Limitations/Constraints

No interruption handling
No persistence between sessions
Single conversation thread only