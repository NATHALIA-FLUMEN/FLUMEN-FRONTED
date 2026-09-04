import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Film, Users, Eye, ShoppingCart, TrendingUp, Wallet, UserCheck, PlayCircle
} from 'lucide-react';
import { adminService } from '../../services/api.js';
import Spinner from '../../components/ui/Spinner.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .getStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-brand-600/10 border border-brand-600/30 rounded-2xl text-brand-300">
        ⚠️ {error}
      </div>
    );
  }

  const cards = [
    { label: 'Videos totales', value: stats.totalVideos, icon: Film, color: 'from-brand-500 to-brand-700' },
    { label: 'Videos publicados', value: stats.publishedVideos, icon: PlayCircle, color: 'from-emerald-500 to-emerald-700' },
    { label: 'Usuarios totales', value: stats.totalUsers, icon: Users, color: 'from-violet-500 to-violet-700' },
    { label: 'Admins', value: stats.adminUsers, icon: UserCheck, color: 'from-yellow-500 to-yellow-700' },
    { label: 'Clientes', value: stats.clientUsers, icon: Users, color: 'from-sky-500 to-sky-700' },
    { label: 'Vistas totales', value: stats.totalViews, icon: Eye, color: 'from-rose-500 to-rose-700' },
    { label: 'Órdenes completadas', value: stats.completedOrders, icon: ShoppingCart, color: 'from-teal-500 to-teal-700' },
    { label: 'Ingresos totales', value: `$${Number(stats.totalRevenue || 0).toFixed(2)}`, icon: Wallet, color: 'from-green-500 to-green-700' }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Resumen general de la plataforma Flumen</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="card-surface p-5">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-lg`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-gray-400">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-surface p-5">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-500" />
            Contenido
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Videos gratuitos</span>
              <span className="text-sm font-semibold text-emerald-400">{stats.freeCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Videos premium (pago)</span>
              <span className="text-sm font-semibold text-brand-400">{stats.paidCount}</span>
            </div>
            <div className="mt-4">
              <Link to="/admin/videos" className="btn-primary w-full justify-center !py-2.5 text-sm">
                Gestionar videos
              </Link>
            </div>
          </div>
        </div>

        <div className="card-surface p-5">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-500" />
            Usuarios y ventas
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Ratio admin/clientes</span>
              <span className="text-sm font-semibold text-white">
                {stats.adminUsers} / {stats.clientUsers}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Ingresos desde compras</span>
              <span className="text-sm font-semibold text-emerald-400">
                ${Number(stats.totalRevenue || 0).toFixed(2)}
              </span>
            </div>
            <div className="mt-4">
              <Link to="/admin/settings" className="btn-secondary w-full justify-center !py-2.5 text-sm">
                Personalizar sitio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
