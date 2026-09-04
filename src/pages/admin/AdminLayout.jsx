import { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Film, Users, Settings, ShoppingCart, LogOut,
  Menu, X, ArrowLeft, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from '../../components/Logo.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const navItems = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/videos', end: false, label: 'Videos', icon: Film },
  { to: '/admin/users', end: false, label: 'Usuarios', icon: Users },
  { to: '/admin/orders', end: false, label: 'Órdenes', icon: ShoppingCart },
  { to: '/admin/settings', end: false, label: 'Personalizar', icon: Settings }
];

export default function AdminLayout() {
  const { user, isAdmin, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: '/admin' }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const SidebarContent = (
    <>
      <div className="flex items-center justify-between px-5 py-5 border-b border-dark-600">
        <Logo />
        <button
          className="lg:hidden text-gray-400 hover:text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-glow'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-dark-600 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-sm font-bold text-white">
            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-yellow-400" />
              Administrador
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-dark-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Ver sitio web
          </NavLink>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-brand-400 hover:bg-dark-700 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen lg:flex pt-16 lg:pt-0">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-dark-800 border-r border-dark-600 h-[calc(100vh-0px)] sticky top-0">
        {SidebarContent}
      </aside>

      {/* Sidebar móvil */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-dark-600 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {SidebarContent}
      </aside>

      {/* Contenido */}
      <div className="flex-1 lg:pt-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-dark-600 fixed top-0 left-0 right-0 z-30">
          <button
            className="text-gray-400 hover:text-white p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-sm font-semibold text-white">Panel de administración</span>
          <div className="w-6"></div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
