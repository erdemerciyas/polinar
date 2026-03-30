import React from 'react'

export default function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '20px 0',
      }}
    >
      <img
        src="/brand_assets/logo.png"
        alt="Polinar"
        style={{
          height: '40px',
          width: 'auto',
          objectFit: 'contain',
        }}
      />
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: 0.45,
          whiteSpace: 'nowrap',
        }}
      >
        CMS
      </span>
    </div>
  )
}
