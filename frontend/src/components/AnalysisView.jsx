import { FiFileText, FiList, FiAlertTriangle, FiHelpCircle, FiPlus, FiMessageSquare } from 'react-icons/fi'

export default function AnalysisView({ analysis, onNewContract, onGoToChat }) {
  if (!analysis) return null

  return (
    <div>
      <div className="analysis-header-actions">
        <button className="btn btn-secondary" onClick={onNewContract}>
          <FiPlus /> Nuevo Análisis
        </button>
        <button className="btn btn-primary" onClick={onGoToChat}>
          <FiMessageSquare /> Preguntar al Abogado IA
        </button>
      </div>

      <div className="analysis-section">
        <h3 className="section-title"><FiFileText /> Resumen Ejecutivo</h3>
        <p>{analysis.summary}</p>
      </div>

      <div className="analysis-section">
        <h3 className="section-title"><FiList /> Cláusulas Principales</h3>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          {analysis.clauses.map((clause, i) => (
            <li key={i} style={{ marginBottom: '0.5rem' }}>{clause}</li>
          ))}
        </ul>
      </div>

      <div className="analysis-section">
        <h3 className="section-title" style={{ color: 'var(--accent)', borderColor: '#fed7d7' }}>
          <FiAlertTriangle /> Alertas y Riesgos
        </h3>
        {analysis.alerts.length === 0 ? (
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>No se encontraron alertas de riesgo.</p>
        ) : (
          <div>
            {analysis.alerts.map((alert, i) => (
              <div key={i} className="alert-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <FiAlertTriangle color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{alert.replace(/^🚨\s*/, '')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="analysis-section">
        <h3 className="section-title"><FiHelpCircle /> Preguntas Sugeridas</h3>
        <ul className="question-list">
          {analysis.questions.map((q, i) => (
            <li key={i} className="question-item">{q}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
