'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

function FloatingInput({
  type = 'text',
  label,
  value,
  onChange,
  required,
  name,
}: {
  type?: string
  label: string
  value: string
  onChange: (val: string) => void
  required?: boolean
  name: string
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div className="contact-field group">
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className="contact-field-input"
        placeholder=" "
      />
      <label className={`contact-field-label ${active ? 'contact-field-label--active' : ''}`}>
        {label}
      </label>
      <div className={`contact-field-line ${focused ? 'contact-field-line--active' : ''}`} />
    </div>
  )
}

function FloatingTextarea({
  label,
  value,
  onChange,
  required,
  name,
}: {
  label: string
  value: string
  onChange: (val: string) => void
  required?: boolean
  name: string
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div className="contact-field group">
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        rows={5}
        className="contact-field-input contact-field-textarea"
        placeholder=" "
      />
      <label className={`contact-field-label ${active ? 'contact-field-label--active' : ''}`}>
        {label}
      </label>
      <div className={`contact-field-line ${focused ? 'contact-field-line--active' : ''}`} />
    </div>
  )
}

export function ContactForm({ formLabels, messages }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const formRef = useRef<HTMLFormElement>(null)

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
    <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FloatingInput
          name="name"
          label={formLabels.nameLabel || ''}
          value={formData.name}
          onChange={(val) => setFormData({ ...formData, name: val })}
          required
        />
        <FloatingInput
          name="email"
          type="email"
          label={formLabels.emailLabel || ''}
          value={formData.email}
          onChange={(val) => setFormData({ ...formData, email: val })}
          required
        />
      </div>

      <FloatingInput
        name="subject"
        label={formLabels.subjectLabel || ''}
        value={formData.subject}
        onChange={(val) => setFormData({ ...formData, subject: val })}
        required
      />

      <FloatingTextarea
        name="message"
        label={formLabels.messageLabel || ''}
        value={formData.message}
        onChange={(val) => setFormData({ ...formData, message: val })}
        required
      />

      <div className="flex items-center gap-5">
        <motion.button
          type="submit"
          disabled={status === 'sending'}
          className="contact-submit-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {status === 'sending' ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {formLabels.sendingButton || ''}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {formLabels.sendButton || ''}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          )}
        </motion.button>

        <AnimatePresence mode="wait">
          {status === 'success' && (
            <motion.p
              key="success"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-emerald-600 font-body text-sm font-medium"
            >
              {messages.success || ''}
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              key="error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-polinar-mustard font-body text-sm font-medium"
            >
              {messages.error || ''}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}
