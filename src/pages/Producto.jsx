import { useParams } from 'react-router-dom'
import RouteShell from './RouteShell'

export default function Producto() {
  const { id } = useParams()
  return <RouteShell kicker="PRODUCTO" title="Detalle de producto"><p>Ruta preparada para el producto #{id}. La funcionalidad se implementará en una fase posterior.</p></RouteShell>
}
