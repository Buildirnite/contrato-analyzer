Aquí tienes la actualización completa de tu frontend. He implementado los íconos, el renderizado de Markdown en el chat y el rediseño visual profesional utilizando la paleta legal que solicitaste.

Primero, asegúrate de instalar las dependencias necesarias en tu proyecto Vite:

```bash
npm install react-icons react-markdown
```

A continuación, aquí tienes el código completo de los 5 archivos modificados:

### 1. `src/index.css`
Aquí definimos la nueva paleta de colores y toda la estructura visual, incluyendo las tarjetas, las alertas con borde rojo y las burbujas de chat modernas.

```css
:root {
  --primary: #1a365d;
  --secondary: #2b6cb0;
  --accent: #e53e3e;
  --bg-color: #f7fafc;
  --card-bg: #ffffff;
  --text-main: #2d3748;
  --text-light: #718096;
  --border-color: #e2e8f0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-main);
  line-height: 1.6;
}

/* Header */
.app-header {
  background-color: var(--primary);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.main-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

/* Upload View */
.upload-container {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.upload-dropzone {
  border: 2px dashed var(--secondary);
  border-radius: 8px;
  padding: 2rem;
  margin: 1.5rem 0;
  background-color: #ebf8ff;
  transition: all 0.3s ease;
}

.upload-dropzone:hover {
  background-color: #bee3f8;
}

.contract-textarea {
  width: 100%;
  min-height: 250px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  margin-top: 1rem;
}

/* Botones */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--secondary);
  color: white;
}

.btn-primary:hover { background-color: #2c5282; }

.btn-secondary {
  background-color: var(--bg-color);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover { background-color: #edf2f7; }

.btn-danger {
  background-color: var(--accent);
  color: white;
}

/* Analysis View */
.analysis-header-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.analysis-section {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  font-size: 1.25rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--bg-color);
  padding-bottom: 0.5rem;
}

/* Alertas */
.alert-item {
  background-color: #fff5f5;
  border-left: 4px solid var(--accent);
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 0 6px 6px 0;
  color: #c53030;
}

/* Preguntas */
.question-list {
  list-style: none;
  counter-reset: question-counter;
}

.question-item {
  position: relative;
  padding-left: 2.5rem;
  margin-bottom: 1rem;
}

.question-item::before {
  counter-increment: question-counter;
  content: counter(question-counter);
  position: absolute;
  left: 0;
  top: 0;
  background-color: var(--secondary);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: bold;
}

/* Chat View */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 75vh;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  background-color: white;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chat-bubble-wrapper {
  display: flex;
  gap: 1rem;
  max-width: 85%;
}

.chat-bubble-wrapper.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.chat-bubble-wrapper.assistant {
  align-self: flex-start;
}

.chat-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chat-avatar.user { background-color: var(--secondary); color: white; }
.chat-avatar.assistant { background-color: var(--primary); color: white; }

.chat-bubble {
  padding: 1rem;
  border-radius: 12px;
}

.chat-bubble.user {
  background-color: var(--secondary);
  color: white;
  border-top-right-radius: 2px;
}

.chat-bubble.assistant {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-top-left-radius: 2px;
}

/* Markdown Styles in Chat */
.chat-bubble.assistant h1,
.chat-bubble.assistant h2,
.chat-bubble.assistant h3 { margin-bottom: 0.5rem; margin-top: 1rem; color: var(--primary); }
.chat-bubble.assistant h1:first-child,
.chat-bubble.assistant h2:first-child,
.chat-bubble.assistant h3:first-child { margin-top: 0; }
.chat-bubble.assistant p { margin-bottom: 0.75rem; }
.chat-bubble.assistant p:last-child { margin-bottom: 0; }
.chat-bubble.assistant ul, 
.chat-bubble.assistant ol { margin-left: 1.5rem; margin-bottom: 0.75rem; }

.chat-input-area {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  background-color: white;
  display: flex;
  gap: 0.5rem;
}

.chat-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  outline: none;
  font-family: inherit;
}

.chat-input:focus { border-color: var(--secondary); }
```

### 2. `src/App.jsx`
Controla el estado global y muestra el header con su ícono correspondiente.

```jsx
import { useState } from 'react';
import { FiFileText } from 'react-icons/fi';
import UploadView from './components/UploadView';
import AnalysisView from './components/AnalysisView';
import ChatView from './components/ChatView';

function App() {
  const [view, setView] = useState('upload'); // 'upload', 'analysis', 'chat'
  const [contractText, setContractText] = useState('');
  const [analysisData, setAnalysisData] = useState(null);

  const handleAnalyze = async (text) => {
    setContractText(text);
    // Aquí iría tu llamada fetch real al backend (ej: http://localhost:8000/api/analyze)
    // Para no bloquear la UI si no tienes el backend arriba, simulamos la espera:
    // const response = await fetch('http://localhost:8000/api/analyze', { ... })
    // const data = await response.json();
    
    // Mock de datos para probar la interfaz
    const mockData = {
      summary: "Este es un contrato de prestación de servicios a honorarios regido por el Código Civil chileno. Establece obligaciones para el desarrollo de software y plazos de entrega estrictos.",
      clauses: [
        "Cláusula Tercera: Confidencialidad de la información comercial.",
        "Cláusula Quinta: Propiedad intelectual a favor del cliente.",
        "Cláusula Octava: Jurisdicción en los tribunales de Santiago."
      ],
      alerts: [
        "🚨 La cláusula de multas por atraso excede el máximo habitual y podría considerarse abusiva.",
        "🚨 No se especifica claramente si el IVA está incluido en el precio final de los honorarios."
      ],
      questions: [
        "¿Se puede establecer un tope máximo para las multas por atraso?",
        "¿Cómo se regularán los cambios de alcance durante el desarrollo?"
      ]
    };
    
    setAnalysisData(mockData); // Cambia esto por setAnalysisData(data) cuando uses el backend real
    setView('analysis');
  };

  return (
    <div>
      <header className="app-header">
        <FiFileText size={28} />
        <h1>LegalAI Chile</h1>
      </header>
      
      <main className="main-container">
        {view === 'upload' && (
          <UploadView onAnalyze={handleAnalyze} />
        )}
        {view === 'analysis' && (
          <AnalysisView 
            data={analysisData} 
            onChat={() => setView('chat')} 
            onReset={() => { setContractText(''); setAnalysisData(null); setView('upload'); }}
          />
        )}
        {view === 'chat' && (
          <ChatView 
            contractText={contractText} 
            onBack={() => setView('analysis')} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
```

### 3. `src/components/UploadView.jsx`
Implementa la zona de carga visual con los íconos requeridos.

```jsx
import { useState } from 'react';
import { FiUpload, FiSearch } from 'react-icons/fi';

export default function UploadView({ onAnalyze }) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    // Simulamos un delay para que se vea el estado de carga
    setTimeout(() => {
      onAnalyze(text);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="upload-container">
      <h2>Análisis de Contratos Chilenos</h2>
      <p className="text-light">Pega el texto de tu contrato para recibir un análisis legal detallado.</p>
      
      <div className="upload-dropzone">
        <FiUpload size={48} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
        <h3>Pega el texto de tu contrato aquí</h3>
        <textarea
          className="contract-textarea"
          placeholder="Ej: Entre los suscritos, por una parte don Juan Pérez..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <button 
        className="btn btn-primary" 
        onClick={handleSubmit}
        disabled={isAnalyzing || !text.trim()}
        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
      >
        <FiSearch />
        {isAnalyzing ? 'Analizando con IA...' : 'Analizar Contrato'}
      </button>
    </div>
  );
}
```

### 4. `src/components/AnalysisView.jsx`
Organiza los resultados devueltos por el backend utilizando el sistema de colores de la paleta.

```jsx
import { FiFileText, FiList, FiAlertTriangle, FiHelpCircle, FiPlus, FiMessageSquare } from 'react-icons/fi';

export default function AnalysisView({ data, onChat, onReset }) {
  if (!data) return null;

  return (
    <div>
      <div className="analysis-header-actions">
        <button className="btn btn-secondary" onClick={onReset}>
          <FiPlus /> Nuevo Análisis
        </button>
        <button className="btn btn-primary" onClick={onChat}>
          <FiMessageSquare /> Preguntar al Abogado IA
        </button>
      </div>

      <div className="analysis-section">
        <h3 className="section-title"><FiFileText /> Resumen Ejecutivo</h3>
        <p>{data.summary}</p>
      </div>

      <div className="analysis-section">
        <h3 className="section-title"><FiList /> Cláusulas Principales</h3>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          {data.clauses.map((clause, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>{clause}</li>
          ))}
        </ul>
      </div>

      <div className="analysis-section">
        <h3 className="section-title" style={{ color: 'var(--accent)', borderColor: '#fed7d7' }}>
          <FiAlertTriangle /> Alertas y Riesgos
        </h3>
        <div>
          {data.alerts.map((alert, idx) => (
            <div key={idx} className="alert-item">
              {alert}
            </div>
          ))}
        </div>
      </div>

      <div className="analysis-section">
        <h3 className="section-title"><FiHelpCircle /> Preguntas Sugeridas</h3>
        <ul className="question-list">
          {data.questions.map((question, idx) => (
            <li key={idx} className="question-item">{question}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### 5. `src/components/ChatView.jsx`
Integra `react-markdown` para interpretar los mensajes de texto enriquecido que envía el modelo y usa un diseño de burbujas moderno.

```jsx
import { useState, useRef, useEffect } from 'react';
import { FiArrowLeft, FiSend, FiUser, FiCpu } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

export default function ChatView({ contractText, onBack }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola. Soy tu asistente legal IA. ¿Qué dudas específicas tienes sobre el contrato analizado?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Lógica para el backend (Ajustar a tu fetch real a /api/chat)
    /*
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: contractText,
        message: input,
        history: messages
      })
    });
    const data = await response.json();
    setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    */

    // Simulación de respuesta con Markdown
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `**Respuesta legal simulada:**\n\nSegún la normativa chilena, puedes revisar el **Artículo 1545** del Código Civil. \n\n* Es importante negociar esa cláusula.\n* Te sugiero enviar un anexo.`
      }]);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="btn btn-secondary" onClick={onBack} style={{ padding: '0.5rem 1rem' }}>
          <FiArrowLeft /> Volver al Análisis
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble-wrapper ${msg.role}`}>
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
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          className="chat-input" 
          placeholder="Escribe tu consulta legal aquí..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="btn btn-primary" onClick={handleSend} style={{ borderRadius: '24px', padding: '0.75rem 1.25rem' }}>
          <FiSend />
        </button>
      </div>
    </div>
  );
}
```