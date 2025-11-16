'use client';

import { useState, useRef, useEffect } from 'react';
import ModelSelector, { Model } from './ModelSelector';

export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string, editMessageId?: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export default function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  selectedModel,
  onModelChange,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim(), editingMessageId || undefined);
      setInput('');
      setEditingMessageId(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleEdit = (messageId: string, currentContent: string) => {
    setEditingMessageId(messageId);
    setInput(currentContent);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#171717] text-white">
      {/* Header with Model Selector */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <ModelSelector
          selectedModel={selectedModel as Model}
          onModelChange={onModelChange}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
            aria-label="Share"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
            aria-label="More options"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center px-4">
              <div className="text-center">
                <h1 className="text-4xl font-semibold text-white">
                  What's on your mind today?
                </h1>
              </div>
            </div>
          ) : (
            <div>
              {messages.map((message, index) => {
                const messageId = message.id || `msg-${index}`;
                return (
                  <div
                    key={messageId}
                    className={`group relative flex gap-3 ${
                      index > 0 ? 'mt-6' : ''
                    } ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex h-8 w-8 flex-shrink-0 items-start pt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="relative flex max-w-[85%] flex-col">
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-800 text-gray-100'
                        }`}
                      >
                        <div className="text-[15px] leading-[1.75] text-inherit">
                          <p className="whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </div>
                      </div>
                      {message.role === 'user' && (
                        <div className="mt-1 flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => handleEdit(messageId, message.content)}
                            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
                            aria-label="Edit message"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            <span>Edit</span>
                          </button>
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="flex h-8 w-8 flex-shrink-0 items-start pt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {isLoading && (
            <div className="mt-6 flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-start pt-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
              </div>
              <div className="rounded-2xl bg-gray-800 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 bg-[#171717] px-4 py-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-end gap-4">
            <button
              type="button"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
              aria-label="Add attachment"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <div className="relative flex-1">
              {editingMessageId && (
                <div className="mb-2 flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-xs text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Editing message</span>
                  <button
                    onClick={handleCancelEdit}
                    className="ml-auto text-gray-500 hover:text-gray-300 transition-colors"
                    aria-label="Cancel edit"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask for translation help"
                disabled={isLoading}
                rows={1}
                className="max-h-[200px] w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-3.5 text-[15px] leading-[1.5] text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:bg-gray-900"
                style={{ minHeight: '44px' }}
                aria-label="Message input"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
                aria-label="Voice input"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
                aria-label="Audio visualization"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </button>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700 text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
