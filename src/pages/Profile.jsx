import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Play, User, ShoppingBag, Settings, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { paymentService } from '../services/api.js';
import Spinner from '../components/ui/Spinner.jsx';

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoadingOrders(true);
    paymentService
      .myOrders()
      .then((res) => setOrders(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        {loading ? <Spinner size="lg" /> : <p className="text-gray-400">Redirigiendo...</p>}
      </div>
    );
  }

  function getInitial() {
    return user.name ? user.name.charAt(0).toUpperCase() : 'U';
  }

  return (
    <div className="container-app py-28 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="card-surface p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-4xl font-bold text-white shadow-glow flex-shrink-0">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              getInitial()
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              {user.name}
              {user.role === 'admin' && (
                <span className="badge bg-brand-600 text-white">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Administrador
                </span>
              )}
            </h1>
            <p className="text-gray-400 mt-1">{user.email}</p>
            <div className="flex gap-2 mt-4 justify-center sm:justify-start">
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="btn-primary !py-2 !px-4 text-sm"
                >
                  <Settings className="w-4 h-4" />
                  Panel de administrador
                </button>
              )}
              <button
                onClick={logout}
                className="btn-secondary !py-2 !px-4 text-sm"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-5 h-5 text-brand-500" />
          <h2 className="font-display text-xl font-bold text-white">Mis compras</h2>
        </div>

        {loadingOrders ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-dark-800 rounded-3xl border border-dashed border-dark-500">
            <ShoppingBag className="w-14 h-14 text-dark-500 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Aún no has comprado videos</p>
            <p className="text-sm text-gray-600 mt-1">Explora el catálogo y desbloquea contenido premium</p>
            <button onClick={() => navigate('/explorar')} className="btn-primary mt-5">
              Explorar catálogo
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {orders.map((order) => {
              const video = order.videos;
              return (
                <div key={order.id} className="card-surface p-4 flex gap-4 items-center">
                  <div className="w-24 aspect-video bg-dark-700 rounded-xl flex-shrink-0 overflow-hidden">
                    {video?.thumbnail_path ? (
                      <img
                        src={video.thumbnail_path}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-500">
                        <Play className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{video?.title || 'Video'}</h3>
                    <p className="text-sm text-emerald-400 mt-1">✓ Comprado · ${order.amount.toFixed(2)}</p>
                    <button
                      onClick={() => navigate(`/video/${order.video_id}`)}
                      className="btn-primary !py-1.5 !px-3 text-xs mt-2"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Reproducir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
