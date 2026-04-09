import { NextRequest, NextResponse } from 'next/server';
import { getGroqChatCompletion } from '@/packages/ai/src/groq';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await getGroqChatCompletion(message, history || []);

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('AI Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
