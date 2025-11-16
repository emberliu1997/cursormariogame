'use client';

import { useState } from 'react';

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
}

interface ConversationsSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export default function ConversationsSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: ConversationsSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex h-full w-64 flex-shrink-0 flex-col bg-[#171717] text-white">
      {/* Header with Logo */}
      <div className="flex items-center gap-3 border-b border-gray-800 px-3 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">
          <svg
            className="h-5 w-5"
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
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">ChatGPT</span>
          <span className="text-xs text-gray-400">5.1</span>
          <svg
            className="h-3 w-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-1 border-b border-gray-800 px-2 py-2">
        <button
          onClick={onNewConversation}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          New chat
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search chats
        </button>
      </div>

      {/* Chats Section */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="mb-4 px-2 py-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase text-gray-400">
              Chats
            </span>
          </div>
        </div>
        {conversations.length === 0 ? (
          <div className="px-2 py-1.5 text-xs text-gray-500">
            No conversations yet
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                  activeConversationId === conv.id
                    ? 'bg-gray-800'
                    : 'hover:bg-gray-800'
                }`}
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectConversation(conv.id)}
              >
                <svg
                  className="h-4 w-4 flex-shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="flex-1 truncate text-gray-300">{conv.title}</span>
                {hoveredId === conv.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <svg
                      className="h-4 w-4 text-gray-400 hover:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-800 px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs font-medium">
            U
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-200">User</div>
            <div className="text-xs text-gray-400">Plus</div>
          </div>
        </div>
      </div>
    </div>
  );
}
