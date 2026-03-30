import React from 'react'

export default function Icon() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
      }}
    >
      <img
        src="/brand_assets/logo.png"
        alt="P"
        style={{
          height: '22px',
          width: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
