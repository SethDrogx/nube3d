import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAssistant from '../hooks/useAssistant'
import { QUICK_ACTIONS } from '../data/chatResponses'

const money = (value) => `$${Number(value).toFixed(2)}`

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const { messages, typing, send: sendMessage, reset } = useAssistant()
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const inputRef = useRef(null)
  const bodyRef = useRef(null)
  useEffect(() => { if (open) inputRef.current?.focus() }, [open])
  useEffect(() => {
    if (open && bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [open, messages, typing])

  const send = (text, intent) => {
    if (sendMessage(text, intent)) setMessage('')
  }
  const action = (item) => item.to ? navigate(item.to) : send(item.label, item.intent)

  return (
    <div className="assistant-wrap">
      <AnimatePresence mode="popLayout">
        {open && (
          <motion.div
            key="chat"
            className="chat-panel"
            id="nube-assistant"
            role="region"
            aria-label="Asistente Nube 3D"
            initial={{ opacity: 0, y: 18, scale: 0.96, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 27 }}
          >
            <div className="chat-head">
              <motion.div className="bot-avatar">
                3D
              </motion.div>
              <div><strong>Asistente Nube</strong><small>Respuestas por reglas · Sin IA</small></div>
              <motion.button whileHover={{ rotate: 90 }} whileTap={{ scale: 0.86 }} onClick={() => { setOpen(false); }} aria-label="Cerrar panel del asistente">×</motion.button>
            </div>
            <div className="chat-toolbar"><button type="button" onClick={() => { reset(); setMessage(''); inputRef.current?.focus() }}>Nueva conversación</button></div>
            <div className="chat-body" ref={bodyRef} role="log" aria-label="Conversación" aria-live="polite" aria-relevant="additions">
              <AnimatePresence initial={false}>
                {messages.map((item) => (
                  <motion.div
                    key={item.id}
                    className={item.role === 'user' ? 'user-bubble' : 'bot-bubble'}
                    initial={{ opacity: 0, x: reducedMotion ? 0 : item.role === 'user' ? 12 : -8, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="chat-speaker">{item.role === 'user' ? 'Tú' : 'Asistente'}</span>
                    <p>{item.text}</p>
                    {item.products?.map((product) => <motion.article className="chat-product" key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}><strong>{product.name}</strong><p>{money(product.price)} · {product.status}</p><button type="button" onClick={() => navigate(`/producto/${encodeURIComponent(product.id)}`)}>Ver producto</button></motion.article>)}
                    {item.quote && <dl className="chat-quote"><dt>Folio</dt><dd>{item.quote.folio}</dd><dt>Fecha</dt><dd>{new Date(item.quote.fechaCreacion).toLocaleString('es-MX')}</dd><dt>Estado</dt><dd>{item.quote.estado}</dd><dt>Descripción resumida</dt><dd>{item.quote.descripcion}</dd></dl>}
                    {item.cart && <p>Artículos: {item.cart.quantity}<br />Total: {money(item.cart.total)}</p>}
                    {item.actions && <div className="chat-actions">{item.actions.map((entry) => <button type="button" key={entry.label} disabled={!entry.to && typing} onClick={() => action(entry)}>{entry.label}</button>)}</div>}
                  </motion.div>
                ))}
              </AnimatePresence>
              {typing && <motion.p className="chat-typing" role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Escribiendo…</motion.p>}
              <div className="quick-options">
                {QUICK_ACTIONS.map((option, index) => (
                  <motion.button
                    key={option.intent}
                    onClick={() => action(option)}
                    disabled={typing}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.045 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>
            <form className="chat-input" onSubmit={(event) => { event.preventDefault(); if (message.trim()) send(message.trim()) }}>
              <input ref={inputRef} maxLength={1000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Escribe un mensaje..." aria-label="Mensaje" onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false) }} />
              <motion.button disabled={typing || !message.trim()} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} aria-label="Enviar mensaje">→</motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && (
          <motion.div
            key="note"
            className="assistant-note"
            initial={{ opacity: 0, x: 16, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.97 }}
            transition={{ delay: 0.45 }}
          >
            ¿Te puedo ayudar con algo?
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="assistant-button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
        aria-expanded={open}
        aria-controls="nube-assistant"
        animate={open || reducedMotion ? { scale: 1 } : { scale: [1, 1.045, 1] }}
        transition={open ? { duration: 0.2 } : { duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.08, rotate: open ? 0 : 3 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="spark">✦</span>
        <span>{open ? '×' : '3D'}</span>
      </motion.button>
    </div>
  )
}
