import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { ROLES, users } from '../data/users'

export default function Login() {
  const { user, login } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [storageWarning, setStorageWarning] = useState(false)

  const destination = location.state?.from === '/admin' ? '/admin' : user?.role === ROLES.SUPER_USUARIO ? '/admin' : '/'
  if (user && !storageWarning) return <Navigate to={destination} replace />

  function handleSubmit(event) {
    event.preventDefault()
    const result = login(email, password)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setPassword('')
    setError('')
    setStorageWarning(!result.persisted)
  }

  return (
    <main>
      <Navbar />
      <section className="auth-page" aria-labelledby="login-title">
        <motion.div className="auth-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="kicker">BIENVENIDO A NUBE 3D</p>
          <h1 id="login-title">Iniciar sesión</h1>
          <p className="auth-intro">Entra con una cuenta de demostración para probar tu sesión.</p>
          {storageWarning ? (
            <div className="auth-storage-notice" role="status">
              <p>Sesión iniciada. El navegador no permite guardarla; al recargar tendrás que iniciar sesión de nuevo.</p>
              <Link className="primary-button" to={destination} replace>Continuar <span aria-hidden="true">↗</span></Link>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <label htmlFor="login-email">Correo electrónico</label>
              <input id="login-email" name="email" type="email" autoComplete="username" required value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} aria-invalid={Boolean(error)} aria-describedby={error ? 'login-error' : undefined} />
              <label htmlFor="login-password">Contraseña</label>
              <div className="auth-password">
                <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} aria-invalid={Boolean(error)} aria-describedby={error ? 'login-error' : undefined} />
                <button type="button" aria-controls="login-password" aria-pressed={showPassword} onClick={() => setShowPassword((current) => !current)}>{showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}</button>
              </div>
              <AnimatePresence initial={false}>
                {error && <motion.p key="error" id="login-error" className="auth-error" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>{error}</motion.p>}
              </AnimatePresence>
              <motion.button className="primary-button auth-submit" type="submit" whileTap={{ scale: 0.98 }}>Iniciar sesión <span aria-hidden="true">↗</span></motion.button>
            </form>
          )}
          <details className="auth-demo">
            <summary>Credenciales de demostración</summary>
            {users.map((demo) => (
              <div className="auth-demo-account" key={demo.id}>
                <strong>{demo.name}</strong>
                <span>{demo.email}</span>
                <span>Contraseña: {demo.password}</span>
              </div>
            ))}
          </details>
          <p className="auth-disclaimer">Acceso mock de desarrollo. Las contraseñas están en el frontend. No es autenticación segura para producción; no uses datos reales.</p>
          <Link className="text-button" to="/catalogo">Seguir explorando sin iniciar sesión <span aria-hidden="true">↗</span></Link>
        </motion.div>
      </section>
      <Footer />
    </main>
  )
}
