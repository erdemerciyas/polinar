'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

type Language = {
  code: string
  label: string
  nativeLabel: string
  shortLabel: string
  flagEmoji: string
  isDefault: boolean
}

type SyncResult = {
  global: string
  locale: string
  updated: number
  skipped: number
  errors: string[]
}

type ImportResponse = {
  success: boolean
  totalUpdated: number
  totalSkipped: number
  totalErrors: number
  results: SyncResult[]
}

type StaticModuleInfo = {
  name: string
  locales: string[]
  hasLocale?: boolean
}

type StaticImportResult = {
  module: string
  status: 'created' | 'updated' | 'error'
  error?: string
}

type StaticImportResponse = {
  success: boolean
  created: number
  updated: number
  totalErrors: number
  results: StaticImportResult[]
}

export function I18nPanel() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLocale, setSelectedLocale] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<ImportResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [forceMode, setForceMode] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; data: any; globalCount: number; fieldCount: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const [staticModules, setStaticModules] = useState<StaticModuleInfo[]>([])
  const [staticResult, setStaticResult] = useState<StaticImportResponse | null>(null)
  const [staticUploadedFile, setStaticUploadedFile] = useState<{ name: string; data: any; moduleCount: number } | null>(null)
  const staticFileInputRef = useRef<HTMLInputElement>(null)
  const [staticDragOver, setStaticDragOver] = useState(false)

  useEffect(() => {
    fetch('/api/i18n/languages', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.languages?.length) {
          setLanguages(data.languages)
          setSelectedLocale(data.languages[0].code)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedLocale) return
    fetch(`/api/i18n/static-modules?locale=${selectedLocale}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.modules) setStaticModules(data.modules)
      })
      .catch(() => {})
  }, [selectedLocale])

  const selectedLang = languages.find((l) => l.code === selectedLocale)

  const handleExport = useCallback(async () => {
    if (!selectedLocale) return
    setLoading('export')
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`/api/i18n/export?locale=${selectedLocale}`, {
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
      a.download = `${selectedLocale}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setLoading(null)
    }
  }, [selectedLocale])

  const processFile = useCallback((file: File) => {
    setError(null)
    setResult(null)

    if (!file.name.endsWith('.json')) {
      setError('Please upload a .json file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('JSON must be an object with global slugs as keys')
        }
        const globalCount = Object.keys(data).length
        const countFields = (obj: any): number => {
          if (obj === null || obj === undefined) return 0
          if (Array.isArray(obj)) return obj.reduce((s, i) => s + countFields(i), 0)
          if (typeof obj === 'object') return Object.values(obj).reduce((s: number, v) => s + countFields(v), 0)
          return 1
        }
        const fieldCount = countFields(data)
        setUploadedFile({ name: file.name, data, globalCount, fieldCount })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid JSON file')
        setUploadedFile(null)
      }
    }
    reader.readAsText(file)
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleImport = useCallback(async () => {
    if (!selectedLocale || !uploadedFile) return
    setLoading('import')
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/i18n/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          locale: selectedLocale,
          data: uploadedFile.data,
          force: forceMode,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      const data: ImportResponse = await res.json()
      setResult(data)
      setUploadedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setLoading(null)
    }
  }, [selectedLocale, uploadedFile, forceMode])

  const handleGenerateFromFile = useCallback(async () => {
    if (!selectedLocale) return
    setLoading('generate')
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/i18n/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ locale: selectedLocale, force: forceMode }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      const data: ImportResponse = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generate failed')
    } finally {
      setLoading(null)
    }
  }, [selectedLocale, forceMode])

  const handleGenerateAll = useCallback(async () => {
    setLoading('generate-all')
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/i18n/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ force: forceMode }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      const data: ImportResponse = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generate all failed')
    } finally {
      setLoading(null)
    }
  }, [forceMode])

  const handleStaticExport = useCallback(async () => {
    if (!selectedLocale) return
    setLoading('static-export')
    setError(null)
    setStaticResult(null)

    try {
      const res = await fetch(`/api/i18n/static-export?locale=${selectedLocale}`, {
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
      a.download = `static-${selectedLocale}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Static export failed')
    } finally {
      setLoading(null)
    }
  }, [selectedLocale])

  const processStaticFile = useCallback((file: File) => {
    setError(null)
    setStaticResult(null)

    if (!file.name.endsWith('.json')) {
      setError('Please upload a .json file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('JSON must be an object with module names as keys')
        }
        setStaticUploadedFile({ name: file.name, data, moduleCount: Object.keys(data).length })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid JSON file')
        setStaticUploadedFile(null)
      }
    }
    reader.readAsText(file)
  }, [])

  const handleStaticFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processStaticFile(file)
  }, [processStaticFile])

  const handleStaticDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setStaticDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processStaticFile(file)
  }, [processStaticFile])

  const handleStaticImport = useCallback(async () => {
    if (!selectedLocale || !staticUploadedFile) return
    setLoading('static-import')
    setError(null)
    setStaticResult(null)

    try {
      const res = await fetch('/api/i18n/static-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          locale: selectedLocale,
          data: staticUploadedFile.data,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      const data: StaticImportResponse = await res.json()
      setStaticResult(data)
      setStaticUploadedFile(null)
      if (staticFileInputRef.current) staticFileInputRef.current.value = ''

      fetch(`/api/i18n/static-modules?locale=${selectedLocale}`, { credentials: 'include' })
        .then((r) => r.json())
        .then((d) => { if (d.modules) setStaticModules(d.modules) })
        .catch(() => {})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Static import failed')
    } finally {
      setLoading(null)
    }
  }, [selectedLocale, staticUploadedFile])

  const groupByLocale = (results: SyncResult[]) => {
    const map = new Map<string, SyncResult[]>()
    for (const r of results) {
      const arr = map.get(r.locale) || []
      arr.push(r)
      map.set(r.locale, arr)
    }
    return map
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>i18n Management</h1>
      <p style={{ opacity: 0.6, marginBottom: 32, fontSize: 13 }}>
        Export, edit, and import translation files per language.
      </p>

      {/* Language selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => { setSelectedLocale(lang.code); setResult(null); setError(null); setUploadedFile(null); setStaticResult(null); setStaticUploadedFile(null) }}
            disabled={!!loading}
            style={{
              padding: '8px 18px',
              fontSize: 14,
              fontWeight: selectedLocale === lang.code ? 700 : 400,
              border: selectedLocale === lang.code ? '2px solid var(--theme-elevation-800, #333)' : '1px solid rgba(128,128,128,0.25)',
              borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
              background: selectedLocale === lang.code ? 'var(--theme-elevation-100, #f5f5f5)' : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            {lang.flagEmoji ? `${lang.flagEmoji} ` : ''}{lang.label}
            {lang.isDefault && <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 4 }}>(default)</span>}
          </button>
        ))}
      </div>

      {selectedLocale && (
        <>
          {/* Export + Generate section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 24,
          }}>
            <div style={{ padding: 20, borderRadius: 8, border: '1px solid rgba(128,128,128,0.15)', background: 'var(--theme-elevation-50, #fafafa)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 0, marginBottom: 4 }}>Export</h3>
              <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>
                Download current {selectedLang?.label || selectedLocale} translations as JSON.
              </p>
              <button
                onClick={handleExport}
                disabled={!!loading}
                style={btnStyle(loading === 'export', '#0070f3')}
              >
                {loading === 'export' ? 'Exporting...' : `Download ${selectedLocale}.json`}
              </button>
            </div>

            <div style={{ padding: 20, borderRadius: 8, border: '1px solid rgba(128,128,128,0.15)', background: 'var(--theme-elevation-50, #fafafa)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 0, marginBottom: 4 }}>Generate from file</h3>
              <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>
                Sync <code>public/locales/{selectedLocale}.json</code> into the database.
              </p>
              <button
                onClick={handleGenerateFromFile}
                disabled={!!loading}
                style={btnStyle(loading === 'generate', '#7c3aed')}
              >
                {loading === 'generate' ? 'Syncing...' : `Generate ${selectedLocale.toUpperCase()}`}
              </button>
            </div>
          </div>

          {/* Import section */}
          <div style={{
            padding: 20,
            borderRadius: 8,
            border: '1px solid rgba(128,128,128,0.15)',
            background: 'var(--theme-elevation-50, #fafafa)',
            marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 0, marginBottom: 4 }}>Import</h3>
            <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>
              Upload an edited JSON file to update {selectedLang?.label || selectedLocale} translations.
            </p>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#0070f3' : 'rgba(128,128,128,0.3)'}`,
                borderRadius: 8,
                padding: '24px 20px',
                textAlign: 'center',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: dragOver ? 'rgba(0,112,243,0.04)' : 'transparent',
                transition: 'all 0.15s',
                marginBottom: 16,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {uploadedFile ? (
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{uploadedFile.name}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.6 }}>
                    {uploadedFile.globalCount} globals, ~{uploadedFile.fieldCount} fields
                  </p>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: 13, opacity: 0.6 }}>
                  Drop a .json file here or click to browse
                </p>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={handleImport}
                disabled={!!loading || !uploadedFile}
                style={btnStyle(loading === 'import', '#16a34a', !uploadedFile)}
              >
                {loading === 'import' ? 'Importing...' : `Import to ${selectedLocale.toUpperCase()}`}
              </button>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, opacity: 0.7 }}>
                <input
                  type="checkbox"
                  checked={forceMode}
                  onChange={(e) => setForceMode(e.target.checked)}
                  disabled={!!loading}
                />
                Force overwrite existing
              </label>

              {uploadedFile && (
                <button
                  onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, opacity: 0.5, textDecoration: 'underline' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Bulk actions */}
          <div style={{
            padding: 16,
            borderRadius: 8,
            border: '1px solid rgba(128,128,128,0.1)',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ fontSize: 13, opacity: 0.6 }}>Bulk:</span>
            <button
              onClick={handleGenerateAll}
              disabled={!!loading}
              style={{
                ...btnSmallStyle(loading === 'generate-all'),
                background: loading === 'generate-all' ? '#666' : 'transparent',
                color: loading === 'generate-all' ? '#fff' : 'inherit',
                border: '1px solid rgba(128,128,128,0.3)',
              }}
            >
              {loading === 'generate-all' ? 'Syncing all...' : 'Generate All Languages'}
            </button>
          </div>
        </>
      )}

      {/* ── Static Content Section ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ borderTop: '2px solid rgba(128,128,128,0.12)', paddingTop: 24, marginTop: 8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, marginTop: 0 }}>Static Content</h2>
          <p style={{ opacity: 0.6, fontSize: 12, marginBottom: 20 }}>
            Product pages, labels, and hardcoded content managed in <code>src/data/</code> files.
          </p>

          {/* Module status */}
          {staticModules.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {staticModules.map((mod) => {
                const has = mod.locales.includes(selectedLocale)
                return (
                  <span
                    key={mod.name}
                    style={{
                      padding: '4px 12px',
                      fontSize: 12,
                      borderRadius: 4,
                      background: has ? 'rgba(34,197,94,0.08)' : 'rgba(234,179,8,0.08)',
                      border: `1px solid ${has ? 'rgba(34,197,94,0.25)' : 'rgba(234,179,8,0.25)'}`,
                      color: has ? '#16a34a' : '#ca8a04',
                    }}
                  >
                    {has ? '●' : '○'} {mod.name}
                  </span>
                )
              })}
            </div>
          )}

          {/* Export + Import grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={{ padding: 20, borderRadius: 8, border: '1px solid rgba(128,128,128,0.15)', background: 'var(--theme-elevation-50, #fafafa)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 0, marginBottom: 4 }}>Export Static</h3>
              <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>
                Download {selectedLang?.label || selectedLocale} static content as JSON.
                {selectedLocale === 'en' && (
                  <span style={{ display: 'block', marginTop: 4, color: '#0070f3' }}>
                    EN is the source of truth — use this to see what needs translating.
                  </span>
                )}
              </p>
              <button
                onClick={handleStaticExport}
                disabled={!!loading}
                style={btnStyle(loading === 'static-export', '#0070f3')}
              >
                {loading === 'static-export' ? 'Exporting...' : `Download static-${selectedLocale}.json`}
              </button>
            </div>

            <div style={{ padding: 20, borderRadius: 8, border: '1px solid rgba(128,128,128,0.15)', background: 'var(--theme-elevation-50, #fafafa)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 0, marginBottom: 4 }}>Import Static</h3>
              <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>
                Upload translated static JSON to create/update <code>src/data/*/</code> files.
                {selectedLocale === 'en' && (
                  <span style={{ display: 'block', marginTop: 4, color: '#dc2626' }}>
                    EN cannot be imported — edit en.ts files directly.
                  </span>
                )}
              </p>

              <div
                onDragOver={(e) => { e.preventDefault(); setStaticDragOver(true) }}
                onDragLeave={() => setStaticDragOver(false)}
                onDrop={handleStaticDrop}
                onClick={() => staticFileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${staticDragOver ? '#0070f3' : 'rgba(128,128,128,0.3)'}`,
                  borderRadius: 8,
                  padding: '16px 12px',
                  textAlign: 'center',
                  cursor: loading || selectedLocale === 'en' ? 'not-allowed' : 'pointer',
                  background: staticDragOver ? 'rgba(0,112,243,0.04)' : 'transparent',
                  transition: 'all 0.15s',
                  marginBottom: 12,
                  opacity: selectedLocale === 'en' ? 0.4 : 1,
                  pointerEvents: selectedLocale === 'en' ? 'none' : 'auto',
                }}
              >
                <input
                  ref={staticFileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleStaticFileChange}
                  style={{ display: 'none' }}
                />
                {staticUploadedFile ? (
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{staticUploadedFile.name}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 11, opacity: 0.6 }}>
                      {staticUploadedFile.moduleCount} module(s)
                    </p>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: 12, opacity: 0.6 }}>
                    Drop static-{selectedLocale}.json or click to browse
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={handleStaticImport}
                  disabled={!!loading || !staticUploadedFile || selectedLocale === 'en'}
                  style={btnStyle(loading === 'static-import', '#16a34a', !staticUploadedFile || selectedLocale === 'en')}
                >
                  {loading === 'static-import' ? 'Importing...' : `Import to ${selectedLocale.toUpperCase()}`}
                </button>
                {staticUploadedFile && (
                  <button
                    onClick={() => { setStaticUploadedFile(null); if (staticFileInputRef.current) staticFileInputRef.current.value = '' }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, opacity: 0.5, textDecoration: 'underline' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Static import results */}
        {staticResult && (
          <div style={{
            padding: 16,
            borderRadius: 8,
            background: staticResult.success ? 'rgba(34,197,94,0.06)' : 'rgba(234,179,8,0.06)',
            border: `1px solid ${staticResult.success ? 'rgba(34,197,94,0.25)' : 'rgba(234,179,8,0.25)'}`,
            marginBottom: 16,
          }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
              Static Import: {staticResult.success ? 'Complete' : 'Completed with errors'}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.7 }}>
              {staticResult.created} created &middot; {staticResult.updated} updated &middot; {staticResult.totalErrors} errors
            </p>
            {staticResult.results.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(128,128,128,0.15)' }}>
                    <th style={thStyle}>Module</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {staticResult.results.map((r) => (
                    <tr key={r.module} style={{ borderBottom: '1px solid rgba(128,128,128,0.08)' }}>
                      <td style={{ ...tdStyle, fontWeight: 500 }}>{r.module}</td>
                      <td style={tdStyle}>
                        <span style={{
                          color: r.status === 'error' ? '#dc2626' : r.status === 'created' ? '#0070f3' : '#16a34a',
                        }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {r.error ? <span style={{ color: '#dc2626' }}>{r.error}</span> : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div style={{ padding: 16, borderRadius: 8, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', marginBottom: 20 }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#dc2626', fontSize: 14 }}>Error</p>
          <p style={{ margin: '4px 0 0', fontSize: 13 }}>{error}</p>
        </div>
      )}

      {/* Results table */}
      {result && (
        <div>
          <div style={{
            padding: 16,
            borderRadius: 8,
            background: result.success ? 'rgba(34,197,94,0.06)' : 'rgba(234,179,8,0.06)',
            border: `1px solid ${result.success ? 'rgba(34,197,94,0.25)' : 'rgba(234,179,8,0.25)'}`,
            marginBottom: 16,
          }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
              {result.success ? 'Operation complete' : 'Completed with errors'}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.7 }}>
              {result.totalUpdated} updated &middot; {result.totalSkipped} skipped &middot; {result.totalErrors} errors
            </p>
          </div>

          {result.results.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(128,128,128,0.15)' }}>
                  <th style={thStyle}>Locale</th>
                  <th style={thStyle}>Global</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Updated</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Skipped</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(groupByLocale(result.results)).map(([locale, items]) =>
                  items.map((r, idx) => (
                    <tr key={`${locale}-${r.global}`} style={{ borderBottom: '1px solid rgba(128,128,128,0.08)' }}>
                      {idx === 0 && (
                        <td rowSpan={items.length} style={{ ...tdStyle, fontWeight: 600, verticalAlign: 'top' }}>
                          {locale.toUpperCase()}
                        </td>
                      )}
                      <td style={tdStyle}>{r.global}</td>
                      <td style={{ ...tdStyle, textAlign: 'right', color: r.updated > 0 ? '#16a34a' : undefined }}>{r.updated}</td>
                      <td style={{ ...tdStyle, textAlign: 'right', color: r.skipped > 0 ? '#ca8a04' : undefined }}>{r.skipped}</td>
                      <td style={tdStyle}>
                        {r.errors.length > 0 ? (
                          <span style={{ color: '#dc2626' }}>{r.errors.join('; ')}</span>
                        ) : r.updated > 0 ? (
                          <span style={{ color: '#16a34a' }}>synced</span>
                        ) : (
                          <span style={{ opacity: 0.4 }}>no changes</span>
                        )}
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontWeight: 600 }
const tdStyle: React.CSSProperties = { padding: '8px 12px' }

function btnStyle(isLoading: boolean, color: string, disabled?: boolean): React.CSSProperties {
  return {
    padding: '10px 22px',
    fontSize: 14,
    fontWeight: 600,
    border: 'none',
    borderRadius: 6,
    cursor: isLoading || disabled ? 'not-allowed' : 'pointer',
    background: isLoading ? '#666' : disabled ? 'rgba(128,128,128,0.2)' : color,
    color: disabled ? 'rgba(128,128,128,0.5)' : '#fff',
    transition: 'background 0.15s',
  }
}

function btnSmallStyle(isLoading: boolean): React.CSSProperties {
  return {
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 5,
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s',
  }
}
