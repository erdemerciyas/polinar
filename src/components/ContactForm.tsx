'use client'

import { useState } from 'react'

type Props = {
  formLabels: {
    nameLabel?: string
    emailLabel?: string
    subjectLabel?: string
    messageLabel?: string
    sendButton?: string
    sendingButton?: string
  }
  messages: {
    success?: string
    error?: string
  }
}

export function ContactForm({ formLabels, messages }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder={formLabels.nameLabel || ''}
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border border-[#ddd] rounded-[3px] px-4 py-3 text-sm font-body focus:outline-none focus:border-polinar-red transition-colors"
        />
        <input
          type="email"
          placeholder={formLabels.emailLabel || ''}
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border border-[#ddd] rounded-[3px] px-4 py-3 text-sm font-body focus:outline-none focus:border-polinar-red transition-colors"
        />
      </div>
      <input
        type="text"
        placeholder={formLabels.subjectLabel || ''}
        required
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        className="w-full border border-[#ddd] rounded-[3px] px-4 py-3 text-sm font-body focus:outline-none focus:border-polinar-red transition-colors"
      />
      <textarea
        placeholder={formLabels.messageLabel || ''}
        required
        rows={6}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="w-full border border-[#ddd] rounded-[3px] px-4 py-3 text-sm font-body focus:outline-none focus:border-polinar-red transition-colors resize-none"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary disabled:opacity-50"
      >
        {status === 'sending' ? (formLabels.sendingButton || '') : (formLabels.sendButton || '')}
      </button>

      {status === 'success' && (
        <p className="text-green-600 font-body text-sm">{messages.success || ''}</p>
      )}
      {status === 'error' && (
        <p className="text-polinar-red font-body text-sm">{messages.error || ''}</p>
      )}
    </form>
  )
}
