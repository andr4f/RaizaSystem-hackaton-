import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, X, Send, Loader2, Sprout } from 'lucide-react'
import { chatApi } from '../../../shared/api/chatApi'
import './LandingChatWidget.css'

const WELCOME =
  'Hola, soy Raíza Asistente. Puedo ayudarte con trazabilidad agrícola, certificaciones, QR de productos y el uso de la plataforma. ¿En qué te puedo ayudar?'

const SUGGESTIONS = [
  '¿Qué es la trazabilidad?',
  '¿Cómo me registro en Raíza?',
  '¿Para quién es la plataforma?',
  '¿Qué muestra el código QR?',
]

function LandingChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight
      }
    })
  }, [])

  useEffect(() => {
    if (open) scrollToBottom()
  }, [open, messages, loading, scrollToBottom])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const send = async (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed || loading) return

    setError(null)
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: trimmed }])
    setLoading(true)

    try {
      const res = await chatApi.ask(trimmed)
      const reply = res?.data?.reply ?? 'No recibí una respuesta. Intenta de nuevo.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el asistente.')
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Lo siento, hubo un problema al procesar tu mensaje. Verifica tu conexión e inténtalo de nuevo.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    send()
  }

  const showWelcome = messages.length === 0 && !loading

  return (
    <div className="lnd-chat" aria-live="polite">
      {open && (
        <div className="lnd-chat__panel" role="dialog" aria-label="Chat con Raíza Asistente">
          <header className="lnd-chat__head">
            <div className="lnd-chat__head-info">
              <div className="lnd-chat__avatar"><Sprout size={18} /></div>
              <div>
                <strong>Raíza Asistente</strong>
                <span>Especialista en trazabilidad</span>
              </div>
            </div>
            <button
              type="button"
              className="lnd-chat__close"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
            >
              <X size={18} />
            </button>
          </header>

          <div className="lnd-chat__messages" ref={listRef}>
            {showWelcome && (
              <div className="lnd-chat__bubble lnd-chat__bubble--bot">
                {WELCOME}
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`lnd-chat__bubble lnd-chat__bubble--${m.role === 'user' ? 'user' : 'bot'}`}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="lnd-chat__bubble lnd-chat__bubble--bot lnd-chat__typing">
                <Loader2 size={16} className="lnd-chat__spin" />
                Escribiendo…
              </div>
            )}
          </div>

          {showWelcome && (
            <div className="lnd-chat__suggestions">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  className="lnd-chat__chip"
                  onClick={() => send(s)}
                  disabled={loading}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {error && <p className="lnd-chat__error">{error}</p>}

          <footer className="lnd-chat__foot">
            <form onSubmit={onSubmit} className="lnd-chat__form">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Escribe tu pregunta…"
                maxLength={2000}
                disabled={loading}
                aria-label="Mensaje para el asistente"
              />
              <button type="submit" disabled={loading || !input.trim()} aria-label="Enviar">
                <Send size={18} />
              </button>
            </form>
            <p className="lnd-chat__hint">
              ¿Listo para empezar? <Link to="/register" onClick={() => setOpen(false)}>Regístrate</Link>
              {' · '}
              <Link to="/login" onClick={() => setOpen(false)}>Inicia sesión</Link>
            </p>
          </footer>
        </div>
      )}

      <button
        type="button"
        className={`lnd-chat__fab${open ? ' lnd-chat__fab--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente Raíza'}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}

export default LandingChatWidget
