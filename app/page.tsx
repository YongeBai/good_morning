'use client';

import { useChat } from 'ai/react';
import { DragEvent, useEffect, useRef, useState } from "react";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]); // This properly clears the chat history
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-4 h-screen flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Chat Support</h1>
          <button
            onClick={handleClearChat}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Clear Chat
          </button>
        </div>

        <div className="space-y-4 mb-4 flex-1 overflow-y-auto">
          {messages.map(message => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${message.role === 'user'
                ? 'bg-blue-100 ml-auto max-w-md'
                : 'bg-gray-100 mr-auto max-w-md'
                }`}
            >
              <div className="font-bold mb-1">
                {message.role === 'user' ? 'You' : 'Support Agent'}
              </div>
              {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            name="prompt"
            value={input}
            onChange={handleInputChange}
            className="flex-1 p-2 border rounded"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}