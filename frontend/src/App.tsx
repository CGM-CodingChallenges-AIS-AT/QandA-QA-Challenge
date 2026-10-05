import { useState, type FormEvent } from 'react'
import './App.css'

type AnswersResponse = { answers: string[] }

async function errorMessage(response: Response): Promise<string> {
  const body = await response.json() as { error?: string }
  return body.error ?? `Anfrage fehlgeschlagen (${response.status})`
}

function App() {
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState('')
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<string[] | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function addQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          answers: answers.split('\n').filter((answer) => answer.trim() !== ''),
        }),
      })
      if (!response.ok) throw new Error(await errorMessage(response))
      setQuestion('')
      setAnswers('')
      setMessage('Frage gespeichert.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Frage konnte nicht gespeichert werden.')
    }
  }

  async function askQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setResults(null)
    try {
      const params = new URLSearchParams({ question: search })
      const response = await fetch(`/api/questions?${params}`)
      if (!response.ok) throw new Error(await errorMessage(response))
      const body = await response.json() as AnswersResponse
      setResults(body.answers)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Antworten konnten nicht abgerufen werden.')
    }
  }

  return (
    <main>
      <h1>Fragen und Antworten</h1>
      <p>Speichere eine Frage mit einer oder mehreren Antworten und stelle sie anschließend mit ihrem genauen Wortlaut.</p>
      <section>
        <h2>Frage hinzufügen</h2>
        <form onSubmit={addQuestion}>
          <label htmlFor="question">Frage</label>
          <input id="question" value={question} onChange={(event) => setQuestion(event.target.value)} required />
          <label htmlFor="answers">Antworten (eine pro Zeile)</label>
          <textarea id="answers" value={answers} onChange={(event) => setAnswers(event.target.value)} required rows={4} />
          <button type="submit">Frage speichern</button>
        </form>
      </section>
      <section>
        <h2>Frage stellen</h2>
        <form onSubmit={askQuestion}>
          <label htmlFor="search">Gesuchte Frage</label>
          <input id="search" value={search} onChange={(event) => setSearch(event.target.value)} required />
          <button type="submit">Antworten anzeigen</button>
        </form>
        {results && (
          <div aria-live="polite">
            <h3>Antworten</h3>
            <ul>{results.map((answer, index) => <li key={index}>{answer}</li>)}</ul>
          </div>
        )}
      </section>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
    </main>
  )
}

export default App
