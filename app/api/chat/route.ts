import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://space.ai-builders.com/backend/v1',
  apiKey: process.env.AI_BUILDER_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, model = 'grok-4-fast' } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Validate model
    const validModels = ['grok-4-fast', 'secondmind-agent-v1'];
    const selectedModel = validModels.includes(model) ? model : 'grok-4-fast';

    const completion = await openai.chat.completions.create({
      model: selectedModel,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({
      message: completion.choices[0]?.message?.content || '',
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get chat completion' },
      { status: 500 }
    );
  }
}

