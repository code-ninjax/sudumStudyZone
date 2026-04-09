'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, User, Trash2, Loader2, Sparkles, Bot } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('sudum_chat_history')
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        const formatted = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
        setMessages(formatted)
      } catch (e) {
        console.error('Failed to parse chat history', e)
      }
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('sudum_chat_history', JSON.stringify(messages))
    }
  }, [messages])

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const history = newMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: history }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Failed to connect')

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err: any) {
      console.error('Chat Error:', err)
      setError('Connection interrupted. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    if (confirm('Clear entire conversation history?')) {
      setMessages([])
      localStorage.removeItem('sudum_chat_history')
    }
  }

  const quickTopics = [
    "Explain Quantum Physics Simply",
    "Physics Practice Problems"
  ]

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)] w-full max-w-4xl mx-auto overflow-hidden relative">
      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 md:py-10 scrollbar-hide space-y-10 pb-44 md:pb-40">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6 md:space-y-8 animate-fade-in px-4">
            <Bot className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-2" />
            <h1 className="text-xl md:text-2xl font-black text-text-light dark:text-text-dark opacity-90 tracking-tight">How can I assist you today?</h1>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {quickTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setInput(topic)}
                  className="px-4 md:px-6 py-2.5 md:py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 rounded-2xl border border-gray-100 dark:border-white/5 transition-all flex items-center gap-2 md:gap-3"
                >
                  <Sparkles className="w-3 h-3 text-primary-light" />
                  {topic}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10 md:space-y-12 max-w-3xl mx-auto">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-4 md:gap-6 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-primary-light text-white border-primary-light' 
                    : 'bg-white dark:bg-subtle-dark text-gray-400 border-gray-100 dark:border-white/5'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 md:w-5 md:h-5" /> : <Bot className="w-4 h-4 md:w-5 md:h-5" />}
                </div>
                
                <div className={`flex-1 space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block text-sm md:text-base leading-relaxed tracking-tight break-words max-w-full ${
                    msg.role === 'user' 
                      ? 'text-text-light dark:text-text-dark font-bold' 
                      : 'text-text-light dark:text-gray-300'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  <div className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-50 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center pt-8">
              <button 
                onClick={clearChat}
                className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-3 h-3" />
                Clear Chat
              </button>
            </div>
          </div>
        )}
        
        {loading && (
          <div className="flex gap-4 md:gap-6 animate-pulse max-w-3xl mx-auto">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 flex items-center justify-center">
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-gray-300 animate-spin" />
            </div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-2 bg-gray-100 dark:bg-white/5 rounded w-3/4"></div>
              <div className="h-2 bg-gray-100 dark:bg-white/5 rounded w-1/2"></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="p-3 md:p-4 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center border border-red-100 dark:border-red-950/30 max-w-md mx-auto">
            {error}
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Input Area - Minimal Style - Compensate for Bottom Nav */}
      <div className="fixed bottom-20 md:bottom-0 left-0 right-0 md:relative bg-gradient-to-t from-white via-white to-transparent dark:from-background-dark dark:via-background-dark dark:to-transparent pt-12 pb-6 md:pb-8 px-4 md:px-0 z-40">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your academic question..."
            disabled={loading}
            className="w-full bg-gray-50 dark:bg-white/5 rounded-2xl px-6 md:px-8 py-5 md:py-6 text-sm font-bold text-text-light dark:text-text-dark outline-none border border-gray-100 dark:border-white/5 focus:border-primary-light/50 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-primary-light text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary-light/20"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </form>
        <p className="mt-4 text-[7px] md:text-[9px] text-gray-400 font-extrabold uppercase text-center tracking-[0.4em] opacity-30 px-4">
          Sudum Assistant • Intelligent Academic Catalyst
        </p>
      </div>
    </div>
  )
}
