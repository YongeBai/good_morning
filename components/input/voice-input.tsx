'use client';

import { createLiveTranscription } from "@/lib/deepgram";
import { useEffect, useRef, useState } from "react";

interface VoiceInputProps {
    isRecording: boolean;
    setIsRecording: (isRecording: boolean) => void;
    onTranscript: (transcript: string) => void;
}

export default function VoiceInput({ isRecording, setIsRecording, onTranscript }: VoiceInputProps) {
    const controlsRef = useRef<{
        pause: () => void;
        resume: () => void;
        cleanup: () => void;
    } | null>(null);
    
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') return;

        if (!isInitialized && isRecording) {
            const initializeRecording = async () => {
                try {
                    const controls = await createLiveTranscription((transcript) => {
                        onTranscript(transcript);
                    });
                    controlsRef.current = controls;
                    setIsInitialized(true);
                } catch (error) {
                    console.error('Failed to initialize recording:', error);
                    setIsRecording(false);
                }
            };
            initializeRecording();
        }
    }, [isRecording, isInitialized, onTranscript, setIsRecording]);

    useEffect(() => {
        if (controlsRef.current && isInitialized) {
            if (isRecording) {
                controlsRef.current.resume();
            } else {
                controlsRef.current.pause();
            }
        }
    }, [isRecording, isInitialized]);

    // // Cleanup effect
    // useEffect(() => {
    //     return () => {
    //         if (controlsRef.current) {
    //             controlsRef.current.cleanup();
    //             controlsRef.current = null;
    //         }
    //     };
    // }, []);

    return null;
} 