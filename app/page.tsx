'use client';

import { useState, useEffect } from 'react';
import ConversationsSidebar, {
  Conversation,
} from './components/ConversationsSidebar';
import ChatInterface, { Message } from './components/ChatInterface';
import { Model } from './components/ModelSelector';

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>('grok-4-fast');

  // Load conversations and model preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('conversations');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setConversations(parsed);
          if (parsed.length > 0) {
            setActiveConversationId(parsed[0].id);
            loadMessages(parsed[0].id);
          }
        } catch (error) {
          console.error('Error loading conversations:', error);
        }
      }

      // Load saved model preference
      const savedModel = localStorage.getItem('selectedModel');
      if (savedModel && (savedModel === 'grok-4-fast' || savedModel === 'secondmind-agent-v1')) {
        setSelectedModel(savedModel as Model);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && conversations.length > 0) {
      try {
        localStorage.setItem('conversations', JSON.stringify(conversations));
      } catch (error) {
        console.error('Error saving conversations:', error);
      }
    }
  }, [conversations]);

  const loadMessages = (conversationId: string) => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`messages_${conversationId}`);
      if (saved) {
        try {
          const loadedMessages = JSON.parse(saved);
          // Ensure all messages have IDs
          const messagesWithIds = loadedMessages.map((msg: Message, index: number) => ({
            ...msg,
            id: msg.id || `msg-${index}`,
          }));
          setMessages(messagesWithIds);
        } catch (error) {
          console.error('Error loading messages:', error);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    }
  };

  const saveMessages = (conversationId: string, msgs: Message[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`messages_${conversationId}`, JSON.stringify(msgs));
      } catch (error) {
        console.error('Error saving messages:', error);
      }
    }
  };

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: '新对话',
      createdAt: Date.now(),
    };
    setConversations([newConv, ...conversations]);
    setActiveConversationId(newConv.id);
    setMessages([]);
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
    loadMessages(id);
  };

  const deleteConversation = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`messages_${id}`);
    }
    if (activeConversationId === id) {
      if (updated.length > 0) {
        setActiveConversationId(updated[0].id);
        loadMessages(updated[0].id);
      } else {
        setActiveConversationId(null);
        setMessages([]);
      }
    }
  };

  const generateTitle = async (allMessages: Message[]): Promise<string> => {
    try {
      // Create a summary of the conversation
      const conversationSummary = allMessages
        .slice(0, 10) // Limit to first 10 messages for summary
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content.slice(0, 100)}`)
        .join('\n');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'user',
              content: `请为以下对话生成一个简短的中文标题（不超过30个字，不要包含引号或特殊符号），标题应该概括整个对话的主要内容：\n\n${conversationSummary}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate title');
      }

      const data = await response.json();
      let title = data.message.trim();
      
      // Clean up the title - remove quotes and extra whitespace
      title = title.replace(/^["']|["']$/g, '').trim();
      
      // Limit to 30 characters
      if (title.length > 30) {
        title = title.slice(0, 30) + '...';
      }
      
      return title || '新对话';
    } catch (error) {
      console.error('Error generating title:', error);
      // Fallback
      return '新对话';
    }
  };

  const sendMessage = async (content: string, editMessageId?: string) => {
    if (!activeConversationId) {
      createNewConversation();
      // Wait a bit for the conversation to be created
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const convId = activeConversationId || Date.now().toString();
    let updatedMessages: Message[];

    if (editMessageId) {
      // Edit mode: find the message and replace it and all subsequent messages
      const editIndex = messages.findIndex((m) => m.id === editMessageId);
      if (editIndex === -1) {
        console.error('Message not found for editing');
        return;
      }

      // Keep messages up to the edited one, then add the new user message
      updatedMessages = [
        ...messages.slice(0, editIndex),
        { id: editMessageId, role: 'user' as const, content },
      ];
    } else {
      // New message: add to the end
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
      };
      updatedMessages = [...messages, userMessage];
    }

    setMessages(updatedMessages);
    saveMessages(convId, updatedMessages);

    // Update conversation title based on all messages (async, non-blocking)
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId ? { ...c, title: '生成标题中...' } : c
      )
    );

    generateTitle(updatedMessages).then((title) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, title } : c
        )
      );
    });

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: data.message,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveMessages(convId, finalMessages);

      // Regenerate title with the complete conversation
      generateTitle(finalMessages).then((title) => {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId ? { ...c, title } : c
          )
        );
      });
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveMessages(convId, finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ConversationsSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={selectConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
      />
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          selectedModel={selectedModel}
          onModelChange={(model) => {
            setSelectedModel(model as Model);
            if (typeof window !== 'undefined') {
              localStorage.setItem('selectedModel', model);
            }
          }}
        />
      </div>
    </div>
  );
}
