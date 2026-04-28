'use client'

import React, { useState } from 'react'

export function I18nPanel() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleExportMaster = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch(`/api/i18n/export-master`, {
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `en.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dışa aktarma başarısız oldu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="i18n-panel">

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 className="i18n-panel__title">Yerelleştirme — JSON Yönetimi</h2>
        <p className="i18n-panel__subtitle">
          Tüm dil içeriklerini statik JSON dosyaları üzerinden yönetin.
        </p>
      </div>

      {/* Export Card */}
      <div className="i18n-export-section">
        <h3>Master JSON İndir</h3>
        <p>
          Bu işlem, Payload CMS üzerindeki tüm İngilizce içerikleri (Navigasyon, Footer, UI Metinleri)
          ve statik metinleri birleştirerek tek bir <code>en.json</code> dosyası halinde indirir.
        </p>

        <ol>
          <li>Aşağıdaki butona tıklayarak en güncel <code>en.json</code> dosyasını indirin.</li>
          <li>İndirdiğiniz dosyayı projenizdeki <code>src/locales/</code> klasörüne kopyalayın.</li>
          <li>Çeviri yapmak istediğiniz diller için kopyalayın (örn: <code>tr.json</code>, <code>de.json</code>).</li>
          <li>İçindeki metinleri çevirin ve Git üzerinden deploy edin.</li>
        </ol>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
          <button
            id="export-master-btn"
            onClick={handleExportMaster}
            disabled={loading}
            className={`i18n-btn i18n-btn--primary${loading ? ' i18n-btn--loading' : ''}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {loading ? 'Hazırlanıyor...' : 'en.json İndir'}
          </button>
        </div>
      </div>

      {/* Success */}
      {success && (
        <div className="i18n-result i18n-result--success" style={{ marginTop: 16 }}>
          <p className="i18n-result__title">İndirme tamamlandı</p>
          <p className="i18n-result__meta">en.json dosyasını src/locales/ klasörüne yerleştirin.</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="i18n-result i18n-result--error" style={{ marginTop: 16 }}>
          <p className="i18n-result__title">Hata</p>
          <p className="i18n-result__meta">{error}</p>
        </div>
      )}

    </div>
  )
}
