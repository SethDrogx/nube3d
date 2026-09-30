import { Link } from 'react-router-dom'

export default function Brand({ light = false }) {
  return (
    <Link className={`brand${light ? ' light' : ''}`} to="/">
      <span className="brand-mark">✦</span>
      <span>NUBE<span>3D</span></span>
    </Link>
  )
}
