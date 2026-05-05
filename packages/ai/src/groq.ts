import Groq from 'groq-sdk';

export async function getGroqChatCompletion(userMessage: string, history: { role: 'user' | 'assistant' | 'system', content: string }[] = []) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const systemPrompt = {
    role: 'system' as const,
    content: `You are the Sudum Study AI Assistant, a high-performance academic mentor for students at Sudum Study Zone. 
    Your tone is ultra-modern, professional, and slightly futuristic. 
    You excel at explaining complex concepts in Physics, Engineering, Computer Science, and Mathematics. 
    Keep your explanations precise, structured, and easy to understand. 
    Use LaTeX for mathematical formulas if possible.
    Current context: Student academic assistance.`
  };

  const messages = [systemPrompt, ...history, { role: 'user' as const, content: userMessage }];

  try {
    const response = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    return response.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error('Groq API Error:', error);
    throw new Error(error.message || 'Error fetching AI response');
  }
}
