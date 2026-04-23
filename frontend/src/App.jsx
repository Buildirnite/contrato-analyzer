import { useState, useEffect } from 'react'
import { FiFileText } from 'react-icons/fi'
import UploadView from './components/UploadView'
import AnalysisView from './components/AnalysisView'
import ChatView from './components/ChatView'
import './index.css'

function loadFromStorage() {
  try {
    const contract = localStorage.getItem('contract') || ''
    const analysis = JSON.parse(localStorage.getItem('analysis'))
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || []
    return { contract, analysis, chatHistory }
  } catch {
    return { contract: '', analysis: null, chatHistory: [] }
  }
}

export default function App() {
  const saved = loadFromStorage()

  const [contract, setContract] = useState(saved.contract)
  const [analysis, setAnalysis] = useState(saved.analysis)
  const [chatHistory, setChatHistory] = useState(saved.chatHistory)
  const [view, setView] = useState(saved.contract && saved.analysis ? 'analysis' : 'upload')

  useEffect(() => {
    localStorage.setItem('contract', contract)
  }, [contract])

  useEffect(() => {
    localStorage.setItem('analysis', JSON.stringify(analysis))
  }, [analysis])

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
  }, [chatHistory])

  function handleAnalysisDone(text, result) {
    setContract(text)
    setAnalysis(result)
    setChatHistory([])
    setView('analysis')
  }

  function handleNewContract() {
    setContract('')
    setAnalysis(null)
    setChatHistory([])
    setView('upload')
  }

  function handleClearSession() {
    localStorage.removeItem('contract')
    localStorage.removeItem('analysis')
    localStorage.removeItem('chatHistory')
    setContract('')
    setAnalysis(null)
    setChatHistory([])
    setView('upload')
  }

  return (
    <div>
      <header className="app-header">
        <FiFileText size={28} />
        <h1>LegalAI Chile</h1>
        {(contract || analysis) && (
          <button className="btn btn-danger" onClick={handleClearSession}>
            Limpiar sesión
          </button>
        )}
      </header>

      <main className="main-container">
        {view === 'upload' && (
          <UploadView onAnalysisDone={handleAnalysisDone} />
        )}
        {view === 'analysis' && (
          <AnalysisView
            analysis={analysis}
            onNewContract={handleNewContract}
            onGoToChat={() => setView('chat')}
          />
        )}
        {view === 'chat' && (
          <ChatView
            contract={contract}
            chatHistory={chatHistory}
            onChatHistoryChange={setChatHistory}
            onBack={() => setView('analysis')}
          />
        )}
      </main>
    </div>
  )
}
