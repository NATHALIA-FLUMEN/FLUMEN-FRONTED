import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, ExternalLink, ArrowLeft, Lock, Loader2 } from 'lucide-react';
import { paymentService } from '../services/api.js';
import Spinner from '../components/ui/Spinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const paymentMethods = [
  { name: 'Tarjetas', desc: 'Visa, Mastercard, Amex', icon: '💳' },
  { name: 'Google Pay / Apple Pay', desc: 'Pagos rápidos con tu wallet', icon: '📱' },
  { name: 'PayPal', desc: 'Paga con tu cuenta PayPal', icon: '🅿️' },
  { name: 'Transferencia', desc: 'Depósito bancario', icon: '🏦' },
  { name: 'Link', desc: 'Pago un toque con Stripe', icon: '🔗' },
  { name: 'BNPL', desc: 'Klarna, Afterpay (paga después)', icon: '🛍️' }
];

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async (videoId) => {
    setError('');
    setProcessing(true);
    try {
      const res = await paymentService.createCheckout(videoId);
      if (res.url) {
        window.location.href = res.url;
      } else {
        navigate(`/video/${videoId}`);
      }
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <div className="container-app py-28 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Pago seguro
          </h1>
          <p className="text-gray-400">
            Desbloquea este video con todos los métodos de pago disponibles
          </p>
        </div>

        <div className="card-surface p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-full aspect-video bg-gradient-to-br from-brand-700/40 to-dark-700 rounded-2xl flex items-center justify-center">
              <Lock className="w-12 h-12 text-brand-400" />
            </div>
          </div>
          {error && (
            <div className="mb-4 p-4 bg-brand-600/10 border border-brand-600/30 rounded-xl text-brand-300 text-sm">
              {error}
            </div>
          )}
          <button
            onClick={() => handleCheckout(id)}
            disabled={processing || !user}
            className="btn-primary w-full !py-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirigiendo a pago seguro...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                {user ? 'Continuar al pago' : 'Inicia sesión para pagar'}
              </span>
            )}
          </button>
        </div>

        <div className="card-surface p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Métodos de pago aceptados
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentMethods.map((m) => (
              <div key={m.name} className="flex items-center gap-3 bg-dark-700/50 rounded-xl p-3">
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Pago cifrado y procesado de forma segura por Stripe
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>

        {!user && (
          <button
            onClick={() => navigate('/auth', { state: { from: `/checkout/${id}` } })}
            className="btn-secondary w-full mt-4"
          >
            Iniciar sesión para continuar
          </button>
        )}
      </div>
    </div>
  );
}
