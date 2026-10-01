import { useState } from 'react'
import { motion } from 'motion/react'
import { useProducts } from '../../context/ProductContext'

export default function AdminCategories() {
  const { categories, products, addCategory, renameCategory, deleteCategory } = useProducts()
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState('')
  const [message, setMessage] = useState('')

  function create(event) {
    event.preventDefault()
    const result = addCategory(newName)
    if (result.ok) { setNewName(''); setMessage('') } else setMessage(result.message)
  }

  function saveRename(name) {
    const result = renameCategory(name, draft)
    if (result.ok) { setEditing(null); setDraft(''); setMessage('') } else setMessage(result.message)
  }

  function remove(name) {
    const result = deleteCategory(name)
    setMessage(result.ok ? '' : result.message)
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading"><div><p className="kicker">ORGANIZACIÓN</p><h1>Categorías</h1><p>Crea, renombra y elimina categorías vacías.</p></div></div>
      <form className="admin-category-create" onSubmit={create}><label htmlFor="new-category">Nueva categoría</label><div><input id="new-category" value={newName} onChange={(event) => { setNewName(event.target.value); setMessage('') }} placeholder="Ej. Decoración" /><button className="primary-button" type="submit">Crear <span>↗</span></button></div></form>
      {message && <p className="admin-form-error" role="alert">{message}</p>}
      <div className="admin-category-list">
        {categories.map((category) => {
          const count = products.filter((product) => product.category === category.name).length
          const isEditing = editing === category.name
          return (
            <motion.article className="admin-category-row" key={category.name} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              <img src={category.image} alt="" />
              <div className="admin-category-name">
                {isEditing ? <input value={draft} onChange={(event) => setDraft(event.target.value)} aria-label={`Nuevo nombre para ${category.name}`} /> : <strong>{category.name}</strong>}
                <span>{count} {count === 1 ? 'producto' : 'productos'}</span>
              </div>
              <div className="admin-category-actions">
                {isEditing ? <><button type="button" onClick={() => saveRename(category.name)}>Guardar</button><button type="button" onClick={() => { setEditing(null); setDraft(''); setMessage('') }}>Cancelar</button></> : <><button type="button" onClick={() => { setEditing(category.name); setDraft(category.name); setMessage('') }}>Renombrar</button><button type="button" className="danger-link" onClick={() => remove(category.name)}>Eliminar</button></>}
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
