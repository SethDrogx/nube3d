import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  return (
    <main>
      <Navbar />
      <div className="admin-shell">
        <AdminSidebar />
        <div className="admin-content"><Outlet /></div>
      </div>
      <Footer />
    </main>
  )
}
