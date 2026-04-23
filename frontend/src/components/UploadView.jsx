import { useState } from 'react'
import { FiUpload, FiSearch, FiCheck, FiAlertTriangle } from 'react-icons/fi'

export default function UploadView({ onAnalysisDone }) {
  const [text, setText] = useState('')
  const [loadedFileName, setLoadedFileName] = useState('')
  const [fileLoading, setFileLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''

    const ext = file.name.split('.').pop().toLowerCase()

    if (ext === 'txt') {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setText(ev.target.result)
        setLoadedFileName(file.name)
        setError('')
      }
      reader.readAsText(file)
      return
    }

    setFileLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Error al procesar el archivo')
      setText(data.text)
      setLoadedFileName(file.name)
    } catch (err) {
      setError(err.message)
    } finally {
      setFileLoading(false)
    }
  }

  async function handleAnalyze() {
    if (!text.trim()) {
      setError('Por favor ingresa o carga el texto del contrato.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Error desconocido')
      onAnalysisDone(text, data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="upload-container">
        <div className="loading-state">
          <div className="spinner" />
          <p>Analizando contrato con IA...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="upload-container">
      <h2>Análisis de Contratos Chilenos</h2>
      <p style={{ color: 'var(--text-light)' }}>
        Pega el texto de tu contrato o carga un archivo PDF, DOCX o TXT para recibir un análisis legal detallado.
      </p>

      <div className="upload-dropzone">
        <FiUpload size={48} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
        <h3>Pega el texto de tu contrato aquí</h3>
        <textarea
          className="contract-textarea"
          placeholder="Ej: Entre los suscritos, por una parte don Juan Pérez..."
          value={text}
          onChange={(e) => { setText(e.target.value); setLoadedFileName('') }}
        />
      </div>

      <div className="upload-actions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label className={`file-input-label${fileLoading ? ' disabled' : ''}`}>
            <FiUpload />
            {fileLoading ? 'Procesando...' : 'Cargar archivo'}
            <input
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileUpload}
              disabled={fileLoading}
            />
          </label>
          {loadedFileName && (
            <span style={{ fontSize: 12, color: 'var(--text-light)', paddingLeft: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiCheck color="green" size={13} /> {loadedFileName}
            </span>
          )}
        </div>

        <button
          className="btn btn-primary"
          onClick={handleAnalyze}
          disabled={!text.trim() || fileLoading}
          style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
        >
          <FiSearch />
          Analizar Contrato
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <FiAlertTriangle color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
