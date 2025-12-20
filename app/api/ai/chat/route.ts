import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json()

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            )
        }

        const apiKey = process.env.GROK_API_KEY

        if (!apiKey) {
            console.error('GROK_API_KEY is not set in environment variables')
            return NextResponse.json(
                { error: 'AI service is not configured. Please contact administrator.' },
                { status: 500 }
            )
        }

        // Call Grok API
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI study assistant for students. You help with course questions, study tips, assignment guidance, and general academic support. Be friendly, encouraging, and educational in your responses.',
                    },
                    ...messages,
                ],
                model: 'grok-4-latest',
                stream: false,
                temperature: 0.7,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('Grok API error:', errorData)
            return NextResponse.json(
                { error: 'Failed to get AI response. Please try again.' },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Extract the AI's response
        const aiMessage = data.choices?.[0]?.message?.content

        if (!aiMessage) {
            return NextResponse.json(
                { error: 'No response from AI' },
                { status: 500 }
            )
        }

        return NextResponse.json({ message: aiMessage })
    } catch (error: any) {
        console.error('Error in Grok API route:', error)
        return NextResponse.json(
            { error: error.message || 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}
