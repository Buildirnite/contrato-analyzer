import { useState, useEffect, useRef } from 'react'
import { FiArrowLeft, FiSend, FiUser, FiCpu, FiAlertTriangle } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'

export default function ChatView({ contract, chatHistory, onChatHistoryChange, onBack }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, loading])

  async function handleSend() {
    const message = input.trim()
    if (!message || loading) return

    const newHistory = [...chatHistory, { role: 'user', content: message }]
    onChatHistoryChange(newHistory)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: contract,
          message,
          history: chatHistory,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Error desconocido')
      onChatHistoryChange([...newHistory, { role: 'assistant', content: data.response }])
    } catch (err) {
      setError(err.message)
      onChatHistoryChange(newHistory.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const allMessages = chatHistory.length === 0
    ? [{ role: 'assistant', content: 'Hola. Soy tu asistente legal IA. ¿Qué dudas específicas tienes sobre el contrato analizado?' }]
    : chatHistory

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="btn btn-secondary" onClick={onBack} style={{ padding: '0.5rem 1rem' }}>
          <FiArrowLeft /> Volver al Análisis
        </button>
      </div>

      <div className="chat-messages">
        {allMessages.map((msg, i) => (
          <div key={i} className={`chat-bubble-wrapper ${msg.role}`}>
            <div className={`chat-avatar ${msg.role}`}>
              {msg.role === 'user' ? <FiUser /> : <FiCpu />}
            </div>
            <div className={`chat-bubble ${msg.role}`}>
              {msg.role === 'assistant' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble-wrapper assistant">
            <div className="chat-avatar assistant"><FiCpu /></div>
            <div className="chat-bubble assistant">
              <div className="chat-typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <FiAlertTriangle color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Escribe tu consulta legal aquí..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          onClick={handleSend}
          disabled={!input.trim() || loading}
          style={{ borderRadius: '24px', padding: '0.75rem 1.25rem' }}
        >
          <FiSend />
        </button>
      </div>
    </div>
  )
}
