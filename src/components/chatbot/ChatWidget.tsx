'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type ChatLabels = {
  title?: string
  placeholder?: string
  welcome?: string
  whatsappLabel?: string
  closeLabel?: string
  errorMessage?: string
  connectionError?: string
}

export function ChatWidget({ labels }: { labels?: ChatLabels | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const t = labels || {}

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en'

  async function handleSend() {
    if (!input.trim() || isStreaming) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsStreaming(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, locale }),
      })

      if (!res.ok) {
        const err = await res.json()
        setMessages([...newMessages, { role: 'assistant', content: err.error || t.errorMessage || '' }])
        setIsStreaming(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) return

      let assistantContent = ''
      setMessages([...newMessages, { role: 'assistant', content: '' }])

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                assistantContent += parsed.text
                setMessages([...newMessages, { role: 'assistant', content: assistantContent }])
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: t.connectionError || '' }])
    }

    setIsStreaming(false)
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-cyan rounded-full shadow-elevated flex items-center justify-center spring-hover"
          aria-label="Open chat"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-48px)] bg-white rounded-[6px] shadow-elevated overflow-hidden flex flex-col" style={{ height: '500px' }}>
          <div className="bg-navy px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan rounded-full flex items-center justify-center">
                <span className="text-white font-display font-bold text-xs">P</span>
              </div>
              <span className="text-white font-display font-semibold text-sm">{t.title || ''}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white text-lg" aria-label={t.closeLabel || 'Close'}>
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="bg-gray-light rounded-[6px] p-3 max-w-[80%]">
                <p className="text-sm font-body text-[#555]">{t.welcome || ''}</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-[6px] p-3 max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-polinar-red text-white'
                      : 'bg-gray-light text-[#333]'
                  }`}
                >
                  <p className="text-sm font-body whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="bg-gray-light rounded-[6px] p-3 max-w-[80%]">
                <span className="inline-block w-2 h-2 bg-[#999] rounded-full animate-pulse"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-2 border-t border-gray-100">
            <a
              href="https://wa.me/905336486134"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[#25D366] font-display font-semibold text-xs hover:underline"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
              {t.whatsappLabel || ''}
            </a>
          </div>

          <div className="p-3 border-t border-gray-100">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend() }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder || ''}
                className="flex-1 border border-[#ddd] rounded-[3px] px-3 py-2 text-sm font-body focus:outline-none focus:border-cyan"
                disabled={isStreaming}
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="bg-polinar-red text-white rounded-[3px] px-4 py-2 font-display font-bold text-sm disabled:opacity-50 spring-hover"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
