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
  const [uploadedFile, setUploadedFile] = useState<{
    name: string
    data: any
    globalCount: number
    fieldCount: number
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const [staticModules, setStaticModules] = useState<StaticModuleInfo[]>([])
  const [staticResult, setStaticResult] = useState<StaticImportResponse | null>(null)
  const [staticUploadedFile, setStaticUploadedFile] = useState<{
    name: string
    data: any
    moduleCount: number
  } | null>(null)
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
          if (typeof obj === 'object')
            return Object.values(obj).reduce((s: number, v) => s + countFields(v), 0)
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

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile],
  )

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

  const handleStaticFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processStaticFile(file)
    },
    [processStaticFile],
  )

  const handleStaticDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setStaticDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) processStaticFile(file)
    },
    [processStaticFile],
  )

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
        .then((d) => {
          if (d.modules) setStaticModules(d.modules)
        })
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

  const resetSelections = () => {
    setResult(null)
    setError(null)
    setUploadedFile(null)
    setStaticResult(null)
    setStaticUploadedFile(null)
  }

  return (
    <div className="i18n-panel">
      <h1 className="i18n-panel__title">i18n Management</h1>
      <p className="i18n-panel__subtitle">
        Export, edit, and import translation files per language.
      </p>

      {/* Language selector */}
      <div className="i18n-lang-selector">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              setSelectedLocale(lang.code)
              resetSelections()
            }}
            disabled={!!loading}
            className={`i18n-lang-selector__btn${selectedLocale === lang.code ? ' i18n-lang-selector__btn--active' : ''}`}
          >
            {lang.label}
            {lang.isDefault && (
              <span className="i18n-lang-selector__btn__default">(default)</span>
            )}
          </button>
        ))}
      </div>

      {selectedLocale && (
        <>
          {/* Export + Generate section */}
          <div className="i18n-section-grid">
            <div className="i18n-card">
              <h3 className="i18n-card__title">Export</h3>
              <p className="i18n-card__desc">
                Download current {selectedLang?.label || selectedLocale} translations as JSON.
              </p>
              <button
                onClick={handleExport}
                disabled={!!loading}
                className={`i18n-btn i18n-btn--blue${loading === 'export' ? ' i18n-btn--loading' : ''}`}
              >
                {loading === 'export' ? 'Exporting...' : `Download ${selectedLocale}.json`}
              </button>
            </div>

            <div className="i18n-card">
              <h3 className="i18n-card__title">Generate from file</h3>
              <p className="i18n-card__desc">
                Sync <code>public/locales/{selectedLocale}.json</code> into the database.
              </p>
              <button
                onClick={handleGenerateFromFile}
                disabled={!!loading}
                className={`i18n-btn i18n-btn--violet${loading === 'generate' ? ' i18n-btn--loading' : ''}`}
              >
                {loading === 'generate' ? 'Syncing...' : `Generate ${selectedLocale.toUpperCase()}`}
              </button>
            </div>
          </div>

          {/* Import section */}
          <div className="i18n-card" style={{ marginBottom: 20 }}>
            <h3 className="i18n-card__title">Import</h3>
            <p className="i18n-card__desc">
              Upload an edited JSON file to update {selectedLang?.label || selectedLocale}{' '}
              translations.
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`i18n-dropzone${dragOver ? ' i18n-dropzone--active' : ''}${loading ? ' i18n-dropzone--disabled' : ''}`}
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
                  <p className="i18n-dropzone__filename">{uploadedFile.name}</p>
                  <p className="i18n-dropzone__meta">
                    {uploadedFile.globalCount} globals, ~{uploadedFile.fieldCount} fields
                  </p>
                </div>
              ) : (
                <p className="i18n-dropzone__placeholder">
                  Drop a .json file here or click to browse
                </p>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={handleImport}
                disabled={!!loading || !uploadedFile}
                className={`i18n-btn i18n-btn--green${loading === 'import' ? ' i18n-btn--loading' : ''}`}
              >
                {loading === 'import' ? 'Importing...' : `Import to ${selectedLocale.toUpperCase()}`}
              </button>

              <label className="i18n-checkbox-label">
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
                  onClick={() => {
                    setUploadedFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="i18n-btn i18n-btn--link"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Bulk actions */}
          <div className="i18n-bulk-bar">
            <span className="i18n-bulk-bar__label">Bulk</span>
            <button
              onClick={handleGenerateAll}
              disabled={!!loading}
              className={`i18n-btn i18n-btn--ghost${loading === 'generate-all' ? ' i18n-btn--loading' : ''}`}
            >
              {loading === 'generate-all' ? 'Syncing all...' : 'Generate All Languages'}
            </button>
          </div>
        </>
      )}

      {/* ── Static Content Section ── */}
      <div className="i18n-section-divider">
        <h2 className="i18n-section-divider__title">Static Content</h2>
        <p className="i18n-section-divider__desc">
          Product pages, labels, and hardcoded content managed in <code>src/data/</code> files.
        </p>

        {/* Module status */}
        {staticModules.length > 0 && (
          <div className="i18n-module-tags">
            {staticModules.map((mod) => {
              const has = mod.locales.includes(selectedLocale)
              return (
                <span
                  key={mod.name}
                  className={`i18n-module-tags__tag ${has ? 'i18n-module-tags__tag--has' : 'i18n-module-tags__tag--missing'}`}
                >
                  {has ? '\u2713' : '\u25CB'} {mod.name}
                </span>
              )
            })}
          </div>
        )}

        {/* Export + Import grid */}
        <div className="i18n-section-grid">
          <div className="i18n-card">
            <h3 className="i18n-card__title">Export Static</h3>
            <p className="i18n-card__desc">
              Download {selectedLang?.label || selectedLocale} static content as JSON.
              {selectedLocale === 'en' && (
                <span className="i18n-card__note i18n-card__note--info">
                  EN is the source of truth — use this to see what needs translating.
                </span>
              )}
            </p>
            <button
              onClick={handleStaticExport}
              disabled={!!loading}
              className={`i18n-btn i18n-btn--blue${loading === 'static-export' ? ' i18n-btn--loading' : ''}`}
            >
              {loading === 'static-export'
                ? 'Exporting...'
                : `Download static-${selectedLocale}.json`}
            </button>
          </div>

          <div className="i18n-card">
            <h3 className="i18n-card__title">Import Static</h3>
            <p className="i18n-card__desc">
              Upload translated static JSON to create/update <code>src/data/*/</code> files.
              {selectedLocale === 'en' && (
                <span className="i18n-card__note i18n-card__note--warning">
                  EN cannot be imported — edit en.ts files directly.
                </span>
              )}
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault()
                setStaticDragOver(true)
              }}
              onDragLeave={() => setStaticDragOver(false)}
              onDrop={handleStaticDrop}
              onClick={() => staticFileInputRef.current?.click()}
              className={`i18n-dropzone${staticDragOver ? ' i18n-dropzone--active' : ''}${loading || selectedLocale === 'en' ? ' i18n-dropzone--disabled' : ''}`}
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
                  <p className="i18n-dropzone__filename">{staticUploadedFile.name}</p>
                  <p className="i18n-dropzone__meta">
                    {staticUploadedFile.moduleCount} module(s)
                  </p>
                </div>
              ) : (
                <p className="i18n-dropzone__placeholder">
                  Drop static-{selectedLocale}.json or click to browse
                </p>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={handleStaticImport}
                disabled={!!loading || !staticUploadedFile || selectedLocale === 'en'}
                className={`i18n-btn i18n-btn--green${loading === 'static-import' ? ' i18n-btn--loading' : ''}`}
              >
                {loading === 'static-import'
                  ? 'Importing...'
                  : `Import to ${selectedLocale.toUpperCase()}`}
              </button>
              {staticUploadedFile && (
                <button
                  onClick={() => {
                    setStaticUploadedFile(null)
                    if (staticFileInputRef.current) staticFileInputRef.current.value = ''
                  }}
                  className="i18n-btn i18n-btn--link"
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
        <div
          className={`i18n-result ${staticResult.success ? 'i18n-result--success' : 'i18n-result--warning'}`}
        >
          <p className="i18n-result__title">
            Static Import: {staticResult.success ? 'Complete' : 'Completed with errors'}
          </p>
          <p className="i18n-result__meta">
            {staticResult.created} created &middot; {staticResult.updated} updated &middot;{' '}
            {staticResult.totalErrors} errors
          </p>
          {staticResult.results.length > 0 && (
            <table className="i18n-table">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {staticResult.results.map((r) => (
                  <tr key={r.module}>
                    <td style={{ fontWeight: 500 }}>{r.module}</td>
                    <td>
                      <span
                        className={`i18n-table__status ${
                          r.status === 'error'
                            ? 'i18n-table__status--error'
                            : r.status === 'created'
                              ? 'i18n-table__status--created'
                              : 'i18n-table__status--updated'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.error ? (
                        <span className="i18n-table__status--error">{r.error}</span>
                      ) : (
                        '\u2014'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="i18n-result i18n-result--error">
          <p className="i18n-result__title">Error</p>
          <p className="i18n-result__meta">{error}</p>
        </div>
      )}

      {/* Results table */}
      {result && (
        <div>
          <div
            className={`i18n-result ${result.success ? 'i18n-result--success' : 'i18n-result--warning'}`}
          >
            <p className="i18n-result__title">
              {result.success ? 'Operation complete' : 'Completed with errors'}
            </p>
            <p className="i18n-result__meta">
              {result.totalUpdated} updated &middot; {result.totalSkipped} skipped &middot;{' '}
              {result.totalErrors} errors
            </p>
          </div>

          {result.results.length > 0 && (
            <table className="i18n-table">
              <thead>
                <tr>
                  <th>Locale</th>
                  <th>Global</th>
                  <th style={{ textAlign: 'right' }}>Updated</th>
                  <th style={{ textAlign: 'right' }}>Skipped</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(groupByLocale(result.results)).map(([locale, items]) =>
                  items.map((r, idx) => (
                    <tr key={`${locale}-${r.global}`}>
                      {idx === 0 && (
                        <td rowSpan={items.length} style={{ fontWeight: 600, verticalAlign: 'top' }}>
                          {locale.toUpperCase()}
                        </td>
                      )}
                      <td>{r.global}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={r.updated > 0 ? 'i18n-table__status--synced' : ''}>
                          {r.updated}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={r.skipped > 0 ? 'i18n-table__status--no-change' : ''}>
                          {r.skipped}
                        </span>
                      </td>
                      <td>
                        {r.errors.length > 0 ? (
                          <span className="i18n-table__status--error">{r.errors.join('; ')}</span>
                        ) : r.updated > 0 ? (
                          <span className="i18n-table__status--synced">synced</span>
                        ) : (
                          <span className="i18n-table__status--no-change">no changes</span>
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
