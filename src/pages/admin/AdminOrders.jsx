import { useEffect, useState } from 'react';
import { ShoppingCart, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { adminService } from '../../services/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { label: 'Pendiente', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  completed: { label: 'Completada', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  failed: { label: 'Fallida', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
  refunded: { label: 'Reembolsada', icon: XCircle, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .getOrders()
      .then((res) => setOrders(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  if (loading) {
    return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  }

  if (error) {
    return <div className="p-6 bg-brand-600/10 border border-brand-600/30 rounded-2xl text-brand-300">⚠️ {error}</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Órdenes y pagos</h1>
        <p className="text-gray-400 text-sm mt-1">Historial de compras de la plataforma</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-dark-800 rounded-3xl border border-dashed border-dark-500">
          <ShoppingCart className="w-14 h-14 text-dark-500 mx-auto mb-3" />
          <p className="text-gray-400">No hay órdenes todavía</p>
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/30">
              <tr className="text-white/60 uppercase text-xs tracking-wider">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Video</th>
                <th className="px-4 py-3 font-medium">Monto</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                return (
                  <tr key={order.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white/70">#{order.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">{order.profiles?.name || '—'}</p>
                        <p className="text-white/50 text-xs">{order.profiles?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/80">{order.videos?.title || '—'}</td>
                    <td className="px-4 py-3 text-white font-semibold">${Number(order.amount).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${status.bg} ${status.color} border`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60">{formatDate(order.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
