'use client';

import { useState, useRef, useEffect } from 'react';

export type Model = 'grok-4-fast' | 'secondmind-agent-v1';

interface ModelSelectorProps {
  selectedModel: Model;
  onModelChange: (model: Model) => void;
}

const models: { id: Model; name: string; description: string }[] = [
  {
    id: 'grok-4-fast',
    name: 'Grok 4 Fast',
    description: 'Fast and efficient',
  },
  {
    id: 'secondmind-agent-v1',
    name: 'SecondMind Agent',
    description: 'Multi-tool agent with web search',
  },
];

export default function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModelInfo = models.find((m) => m.id === selectedModel);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label="Select model"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-[15px]">{selectedModelInfo?.name || 'Select Model'}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-700 bg-gray-800 shadow-2xl backdrop-blur-sm">
            <div className="p-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2.5 text-left transition-all ${
                    selectedModel === model.id
                      ? 'bg-gray-700 text-white shadow-sm'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                  aria-pressed={selectedModel === model.id}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-[15px]">{model.name}</div>
                    {selectedModel === model.id && (
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-400">{model.description}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

