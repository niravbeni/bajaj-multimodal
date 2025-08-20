import { NextRequest, NextResponse } from 'next/server';
import { chatMock } from '../../../../lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { messages, latest } = await request.json();
    
    // Validate input
    if (!latest || typeof latest !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // Always use hardcoded responses
    const response = await chatMock(messages || [], latest);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback response
    return NextResponse.json({ 
      response: 'Sorry, I encountered an issue. Please try asking again.' 
    });
  }
} 