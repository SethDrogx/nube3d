import { useEffect, useReducer, useRef, useState } from 'react'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { useQuotes } from '../context/QuoteContext'
import { conversationReducer, initialConversation, respondToMessage } from '../services/chatAssistantService'

export default function useAssistant() {
  const { products } = useProducts()
  const { totalQuantity, total } = useCart()
  const { getPublicQuoteByFolio } = useQuotes()
  const [conversation, dispatch] = useReducer(conversationReducer, undefined, initialConversation)
  const [typing, setTyping] = useState(false)
  const timer = useRef(null)
  const busy = useRef(false)
  const nextId = useRef(0)
  const latest = useRef(null)
  latest.current = { products, cart: { totalQuantity, total }, getPublicQuoteByFolio, state: conversation.state }
  useEffect(() => () => window.clearTimeout(timer.current), [])
  function send(text, intent) {
    const trimmed = text.trim().slice(0, 1000)
    if (!trimmed || busy.current) return false
    busy.current = true
    dispatch({ type: 'user', message: { id: ++nextId.current, role: 'user', text: trimmed } })
    setTyping(true)
    timer.current = window.setTimeout(() => {
      const response = respondToMessage({ ...latest.current, text: trimmed, intent })
      dispatch({ type: 'response', response, message: { id: ++nextId.current, ...response.message } })
      busy.current = false
      setTyping(false)
    }, 350)
    return true
  }
  function reset() {
    window.clearTimeout(timer.current)
    busy.current = false
    setTyping(false)
    dispatch({ type: 'reset' })
  }
  return { ...conversation, typing, send, reset }
}
