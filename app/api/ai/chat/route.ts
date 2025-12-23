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

        const apiKey = process.env.GEMINI_API_KEY

        if (!apiKey) {
            console.error('GEMINI_API_KEY is not set in environment variables')
            return NextResponse.json(
                { error: 'AI service is not configured. Please contact administrator.' },
                { status: 500 }
            )
        }

        // Convert messages to Gemini format
        const contents = messages.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }))

        // Add system instruction at the beginning
        const systemInstruction = {
            parts: [
                {
                    text: 'You are a helpful AI study assistant for students. You help with course questions, study tips, assignment guidance, and general academic support. Be friendly, encouraging, and educational in your responses.',
                },
            ],
        }

        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    system_instruction: systemInstruction,
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                    },
                }),
            }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('Gemini API error:', errorData)
            return NextResponse.json(
                { error: 'Failed to get AI response. Please try again.' },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Extract the AI's response from Gemini format
        const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!aiMessage) {
            console.error('No text found in Gemini response:', data)
            return NextResponse.json(
                { error: 'No response from AI' },
                { status: 500 }
            )
        }

        return NextResponse.json({ message: aiMessage })
    } catch (error: any) {
        console.error('Error in Gemini API route:', error)
        return NextResponse.json(
            { error: error.message || 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}
